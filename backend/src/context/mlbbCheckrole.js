import axios from "axios";
import { load } from "cheerio";
import qs from "qs";

export default function mlbbCheckrole(app) {
  app.get("/mlbb/checkrole", async (req, res) => {
    try {
      const { user_id, zone_id } = req.query;

      if (!user_id || !zone_id) {
        return res.status(400).json({
          success: false,
          message: "user_id and zone_id are required",
        });
      }

      const response = await axios.post(
        "https://pizzoshop.com/mlchecker/check",
        qs.stringify({ user_id, zone_id }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) Chrome/143 Safari/537.36",
            Origin: "https://pizzoshop.com",
            Referer: "https://pizzoshop.com/mlchecker",
          },
        }
      );

      const html = response.data;
      const $ = load(html);

      const title = $("h4").text().trim();

      if (!title.includes("Account found")) {
        return res.json({
          success: false,
          message: "Account not found",
        });
      }

      const rows = $("table tr");

      return res.json({
        success: true,
        nickname: $(rows[0]).find("td").text().trim(),
        region: $(rows[1]).find("td").text().trim(),
        last_login: $(rows[2]).find("td").text().trim(),
        created_data_date: $(rows[3]).find("td").text().trim(),
      });
    } catch (err) {
      console.error("MLBB Checkrole Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  console.log("✅ MLBB Checkrole API loaded");
}
