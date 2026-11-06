# Shadowchat PeerTube Plugin

A hastily vibe-coded project created using *Claude*, but actually done exclusively through Brave Search's "Ask" feature, which is just a wrapper around Claude. I told it what I wanted, and it told me what to do. Does that count as vibe coding? You be the judge.

But the answer is Yes.

## What does it do?

The "Shadowchat" plugin is a companion app to [Shadowchat](https://shadowchat.app) proper (the zero-confirmation, javascript-optional, monero-only superchat app for livestreams), which creates a Superchat button and a pop-up window in the view page of a PeerTube livestream, allowing a viewer to send a superchat without leaving the page. As a companion app, it naturally requires a Shadowchat instance to be pointed at to work. Consult the [GitGud repository](https://gitgud.io/greyarea/shadowchat) for more details on setting that up.

## Installation

The plugin has no dependencies, and can simply be installed into a working PeerTube instance by copying the files onto the same machine and using the built-in install command:
```
cd /var/www/peertube/peertube-latest
sudo -u peertube NODE_CONFIG_DIR=/var/www/peertube/config NODE_ENV=production npm run plugin:install -- --plugin-path /path/to/peertube-plugin-shadowchat
```
Then just restart PeerTube.

## Setup

In **Settings -> Plugins/Themes**, go to shadowchat plugin's settings and add the URL of the Shadowchat instance you want to use. Then click "Update plugin settings".
Following that, go to the "Manage" page for any livestream and check the "Enable XMR Superchat" box in the Main Information tab, and then "Save".

An "XMR Superchat" button will now appear under the video, which anybody can use to send messages and XMR payments to your Shadowchat instance without leaving the page.

## Limitations

Currently, the plugin can only point to one Shadowchat instance, which is globally applied to any livestream it's enabled on. Per-user settings are more difficult by an order of magnitude, but I may attempt it some day. Due to the fact that this is a personal project, and a vibe-coded one at that, I have no plans to upload or submit it to the official PeerTube plugin catalog. But more talented programmers than myself are free to fork and modify this to add new functionality.
