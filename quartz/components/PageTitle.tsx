import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  const iconSrc = `${baseDir}/static/icon.png`;
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <img src={iconSrc} alt="icon" class="page-title-icon" />
      <a href={baseDir}>{title}</a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
  display: flex;
  align-items: center;
}

.page-title-icon {
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5rem;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
