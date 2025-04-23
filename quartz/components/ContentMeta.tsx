import { Date, getDate, formatDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import { GlobalConfiguration } from "../cfg"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
  showAsPropertiesBlock: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showAsPropertiesBlock: false,
}

function displayTime(cfg: GlobalConfiguration, text: string) {
  const { minutes, words: _words } = readingTime(text)
  return i18n(cfg.locale).components.contentMeta.readingTime({
    minutes: Math.ceil(minutes),
  })
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (options.showAsPropertiesBlock) {
        if (fileData.dates) {
          const createdDate = fileData.dates.created
          const modifiedDate = fileData.dates.modified

          segments.push(<div>Created: <Date date={createdDate} locale={cfg.locale} /></div>);
          if (formatDate(createdDate, cfg.locale) != formatDate(modifiedDate, cfg.locale)) {
            segments.push(<div>Modified: <Date date={modifiedDate} locale={cfg.locale} /></div>);
          }
        }

        if (options.showReadingTime) {
          const displayedTime = displayTime(cfg, text)
          segments.push(<div>Size: {displayedTime}</div>)
        }
      } else {
        if (fileData.dates) {
          segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
        }

        // Display reading time if enabled
        if (options.showReadingTime) {
          const displayedTime = displayTime(cfg, text)
          segments.push(<span>{displayedTime}</span>)
        }
      }

      return (
        <div show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </div>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
