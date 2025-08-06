const Contact = require("../models/contactModel");

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, orderNumber, formType } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, subject, and message"
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Validate formType
    const validFormTypes = ['general', 'support', 'wholesale'];
    if (formType && !validFormTypes.includes(formType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form type. Must be one of: general, support, wholesale"
      });
    }

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      orderNumber: orderNumber || undefined,
      formType: formType || 'general'
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully. We'll get back to you soon!",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        formType: contact.formType,
        submittedAt: contact.submittedAt
      }
    });

  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form. Please try again later."
    });
  }
};

// @desc    Get all contact submissions (admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts: contacts.map(contact => ({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        orderNumber: contact.orderNumber,
        formType: contact.formType,
        status: contact.status,
        submittedAt: contact.submittedAt
      }))
    });

  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact submissions"
    });
  }
};

// @desc    Get a single contact submission by ID (admin only)
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found"
      });
    }

    res.status(200).json({
      success: true,
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        orderNumber: contact.orderNumber,
        formType: contact.formType,
        status: contact.status,
        submittedAt: contact.submittedAt
      }
    });

  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact submission"
    });
  }
};

// @desc    Update contact status (admin only)
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid status: pending, in-progress, resolved, or closed"
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        orderNumber: contact.orderNumber,
        formType: contact.formType,
        status: contact.status,
        submittedAt: contact.submittedAt
      }
    });

  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact status"
    });
  }
};

// @desc    Delete a contact submission (admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact submission"
    });
  }
};

module.exports = {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
}; 