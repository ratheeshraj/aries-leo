const Airtable = require("airtable");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

class AirtableController {
  constructor() {
   
    // Validate environment variables
    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error(
        "AIRTABLE_API_KEY is not defined in environment variables"
      );
    }

    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error(
        "AIRTABLE_BASE_ID is not defined in environment variables"
      );
    }

    // Initialize Airtable
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY,
    });

    this.base = Airtable.base(process.env.AIRTABLE_BASE_ID);
  }

  async getBlogs(req, res) {
    try {
      const records = await this.base("Blogs")
        .select({
          view: "Grid view",
        })
        .all();
        
      const blogs = records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));

      return res.status(200).json({
        success: true,
        data: blogs,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch blogs",
      });
    }
  }

  async getTeamMembers(req, res) {
    try {
      const records = await this.base("Team")
        .select({
          filterByFormula: '{isActive} = 1',
          fields: ["Name", "Description", "Image", "Designation", "isActive"],
        })
        .all();
      const team = records.map((record) => ({
        id: record.id,
        name: record.get("Name"),
        description: record.get("Description"),
        image: record.get("Image") && record.get("Image")[0]?.url,
        designation: record.get("Designation"),
        isActive: record.get("isActive"),
      }));
      return res.status(200).json({
        success: true,
        data: team,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch team members",
      });
    }
  }
}

module.exports = { AirtableController };
