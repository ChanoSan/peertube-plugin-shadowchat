/**
 * PeerTube plugin server: Shadowchat Superchat
 *
 * Registers:
 *   - A plugin setting (Shadowchat URL)
 *   - A proxy route that forwards requests to Shadowchat (same-origin for the client)
 */

module.exports.register = async function (options) {
  const {
    registerSetting,
    getRouter,
    settingsManager,
    peertubeHelpers,
    registerHook,
    storageManager
  } = options

  const logger = peertubeHelpers.logger

  registerSetting({
    name: "shadowchatUrl",
    type: "input",
    label: "Shadowchat URL",
    descriptionHTML: "Base URL of your Shadowchat instance",
    default: "http://172.17.0.1:8900",
    private: false
  })

  const router = getRouter()

  router.all("/proxy/*", async (req, res) => {
    try {
      const rawUrl = (await settingsManager.getSetting("shadowchatUrl")) || "http://172.17.0.1:8900"
      const shadowchatUrl = rawUrl.replace(/\/$/, "")
      const subPath = req.params[0] || ""
      const targetUrl = shadowchatUrl + "/" + subPath

      const qs = req.query && Object.keys(req.query).length
        ? "?" + new URLSearchParams(req.query).toString()
        : ""

      const opts = {
        method: req.method,
        headers: {
          "Content-Type": req.headers["content-type"] || "application/x-www-form-urlencoded",
          "Accept-Language": req.headers["accept-language"] || "en-US"
        }
      }

      if (req.method === "POST" && req.body) {
        const params = new URLSearchParams()
        for (const [k, v] of Object.entries(req.body)) {
          params.append(k, String(v))
        }
        opts.body = params.toString()
      }

      const upstream = await fetch(targetUrl + qs, opts)
      const body = await upstream.text()

      res.status(upstream.status)
      res.type(upstream.headers.get("content-type") || "text/html")
      res.send(body)
    } catch (err) {
      logger.error("[shadowchat] proxy error: " + err.message)
      res.status(502).json({ error: "Shadowchat unreachable: " + err.message })
    }
  })

  registerHook({
    target: "action:api.video.created",
    handler: async ({ video, req }) => {
      const val = req.body?.pluginData?.shadowchat_enabled
      if (val === undefined) return
      await storageManager.storeData("shadowchat_enabled-" + video.id, val)
    }
  })

  registerHook({
    target: "action:api.video.updated",
    handler: async ({ video, req }) => {
      const val = req.body?.pluginData?.shadowchat_enabled
      if (val === undefined) return
      await storageManager.storeData("shadowchat_enabled-" + video.id, val)
    }
  })

  registerHook({
    target: "filter:api.video.get.result",
    handler: async (video) => {
      if (!video) return video
      if (!video.pluginData) video.pluginData = {}
      const val = await storageManager.getData("shadowchat_enabled-" + video.id)
      video.pluginData.shadowchat_enabled = val
      return video
    }
  })

  logger.info("[shadowchat] plugin registered")
}

module.exports.unregister = async function () {}
