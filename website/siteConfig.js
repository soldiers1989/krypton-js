/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'Krypton Wallet',
    image: 'https://github.com/kazeblockchain/krypton-wallet/blob/dev/icons/png/512x512.png?raw=true',
    infoLink: 'http://kryptonwallet.com/',
    pinned: true
  }
]

const siteConfig = {
  title: 'krypton-js' /* title for your website */,
  tagline: 'JS SDK for KAZE blockchain',
  url: 'http://kazeblockchain.io' /* your website url */,
  baseUrl: '/krypton-js/' /* base url for your project */,
  projectName: 'krypton-js',
  headerLinks: [
    { doc: 'installation', label: 'Docs' },
    { doc: 'api-index', label: 'API' },
    { doc: 'changelog-latest', label: 'Changelog' },
    { page: 'help', label: 'Help' },
    { languages: true }
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/logo.svg',
  footerIcon: 'img/logo.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#212146',
    secondaryColor: '#2b2b5e'
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Ethan Fast, Yak Jun Xiang',
  organizationName: 'kazeblockchain', // or set an env variable ORGANIZATION_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'dracula'
  },
  scripts: ['https://buttons.github.io/buttons.js', 'https://unpkg.com/@kazeblockchain/krypton-js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/kazeblockchain/krypton-js'
}

module.exports = siteConfig
