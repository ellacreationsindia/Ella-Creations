<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Ella Creations - Handcrafted Luxury Jewelry</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #2D2424;
            background-color: #FAF4EE;
            margin: 0;
            padding: 30px 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(184, 112, 128, 0.08);
            border: 1px solid #DFCBB9;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #1A1A1A 0%, #2D2424 100%);
            color: #ffffff;
            padding: 30px;
            border-bottom: 3px solid #B87080;
          }
          .header h1 {
            margin: 0 0 8px 0;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .header p {
            margin: 0;
            font-size: 14px;
            color: #E6D2C4;
            line-height: 1.5;
          }
          .header .brand-badge {
            display: inline-block;
            background: rgba(184, 112, 128, 0.25);
            border: 1px solid #B87080;
            color: #FAF4EE;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 4px 12px;
            border-radius: 999px;
            margin-bottom: 12px;
          }
          .stats {
            display: flex;
            gap: 20px;
            padding: 16px 30px;
            background: #FDF9F5;
            border-bottom: 1px solid #F0E4D8;
            font-size: 13px;
            color: #6E5D4F;
          }
          .stats strong {
            color: #B87080;
          }
          .table-wrapper {
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            background: #F7EEE5;
            color: #4A3E3D;
            text-align: left;
            padding: 14px 18px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.8px;
            border-bottom: 1px solid #DFCBB9;
          }
          td {
            padding: 12px 18px;
            border-bottom: 1px solid #F4EBE2;
            vertical-align: middle;
          }
          tr:hover td {
            background-color: #FDF7F2;
          }
          a {
            color: #B87080;
            text-decoration: none;
            word-break: break-all;
            font-weight: 500;
          }
          a:hover {
            color: #8E4C5A;
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            background: #F2E3DA;
            color: #6E5D4F;
          }
          .priority-high {
            background: #FBEAEB;
            color: #B87080;
          }
          .footer {
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #8C7B70;
            background: #FAF4EE;
            border-top: 1px solid #DFCBB9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="brand-badge">Ella Creations • Official XML Sitemap</span>
            <h1>XML Sitemap Index</h1>
            <p>This is a machine-readable XML sitemap formatted with an XSL stylesheet for search engine crawlers (Google, Bing) and human inspection.</p>
          </div>
          
          <div class="stats">
            <div>Total Indexed URLs: <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong></div>
            <div>Generated For: <strong>https://ella-creations.com</strong></div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 55%;">URL Location</th>
                  <th style="width: 15%;">Images</th>
                  <th style="width: 12%;">Change Freq</th>
                  <th style="width: 8%;">Priority</th>
                  <th style="width: 10%;">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}" target="_blank">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:value-of select="count(image:image)"/> Image(s)
                    </td>
                    <td>
                      <span class="badge">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td>
                      <span class="badge priority-high">
                        <xsl:value-of select="sitemap:priority"/>
                      </span>
                    </td>
                    <td style="color: #6E5D4F;">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer">
            &amp;copy; Ella Creations India. Handcrafted Luxury Artificial Jewelry. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
