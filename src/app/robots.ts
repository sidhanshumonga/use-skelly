import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://useskelly.dev/sitemap.xml",
    host: "https://useskelly.dev"
  };
}
