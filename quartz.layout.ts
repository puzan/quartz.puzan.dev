import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { baseUrl } from "./config"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Graph(),
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: 'puzan/quartz.puzan.dev',
        repoId: 'R_kgDOOckvtw',
        category: 'Announcements',
        categoryId: 'DIC_kwDOOckvt84Cpbmp',
        darkTheme: 'catppuccin_frappe',
        lightTheme: 'catppuccin_latte',
        themeUrl: 'https://giscus.app/themes',
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/puzan",
      Telegram: "https://t.me/izonov",
      ПузоТерка: "https://t.me/ArchPuzoTerka",
      RSS: `https://${baseUrl}/index.xml`,
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta({
      showComma: false,
      showReadingTime: true,
      showAsPropertiesBlock: true,
    }),
    Component.TagList(),
  ].map((component) =>
    Component.ConditionalRender({
      component,
      condition: (page) => page.fileData.slug !== "index",
    }),
  ),
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [Component.DesktopOnly(Component.TableOfContents()), Component.Backlinks()],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
