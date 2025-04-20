import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { baseUrl } from "./config"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "🏡 Цифровой Пузатый Сад",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: null,
    locale: "en-US",
    baseUrl,
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "JetBrains Mono",
        body: "JetBrains Mono",
        code: "JetBrains Mono",
      },
      // Base on https://catppuccin.com
      colors: {
        lightMode: {
          light: "rgb(239, 241, 245)", // Base
          lightgray: "rgb(204, 208, 218)", // Surface 0
          gray: "rgb(108, 111, 133)", // Subtext 0
          darkgray: "rgb(76, 79, 105)", // Text
          dark: "rgb(114, 135, 253)", // Lavender
          secondary: "rgb(76, 79, 105)", // Text
          tertiary: "rgb(124, 127, 147)", // Overlay 2
          highlight: "rgba(30, 102, 245)", // Blue
          textHighlight: "rgb(220, 138, 120)", // Rosewater
          fontHighlight: "rgb(230, 233, 239)", // Mantle
          externalLink: "rgb(23, 146, 153)", // Teal
          activeMenu: "rgb(136, 57, 239)", // Mauve
        },
        darkMode: {
          light: "rgb(48, 52, 70)", // Base
          lightgray: "rgb(65, 69, 89)", // Surface 0
          gray: "rgb(165, 173, 206)", // Subtext 0
          darkgray: "rgb(198, 208, 245)", // Text
          dark: "rgb(186, 187, 241)", // Lavender
          secondary: "rgb(198, 208, 245)", // Text
          tertiary: "rgb(148, 156, 187)", // Overlay 2
          highlight: "rgb(140, 170, 238)", // Blue
          textHighlight: "rgb(242, 213, 207)", // Rosewater
          fontHighlight: "rgb(41, 44, 60)", // Mantle
          externalLink: "rgb(129, 200, 190)", // Teal
          activeMenu: "rgb(202, 158, 230)", // Mauve
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Poetry(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
