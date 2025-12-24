
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/authentication/login/login.component.ts": [
    "chunk-6V3YROSX.js",
    "chunk-TAZLO56O.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/authentication/email-recovery/email-recovery.component.ts": [
    "chunk-KYPTNDZQ.js",
    "chunk-VZWXNDCT.js",
    "chunk-TAZLO56O.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/authentication/login-two/login-two.component.ts": [
    "chunk-SUMWZIUS.js",
    "chunk-VZWXNDCT.js",
    "chunk-TAZLO56O.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/authentication/password-update/password-update.component.ts": [
    "chunk-UDO5PSZJ.js",
    "chunk-TAZLO56O.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/shared/component/layout/layout.component.ts": [
    "chunk-VMY3OYPN.js",
    "chunk-TAZLO56O.js",
    "chunk-QHMR3ZOF.js",
    "chunk-7AAP2OSY.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/bussines/dashboard/dashboard.component.ts": [
    "chunk-Z7RARL7S.js"
  ],
  "src/app/bussines/domain/domain.component.ts": [
    "chunk-L7XSDSE2.js",
    "chunk-TAZLO56O.js",
    "chunk-OOY6EHW7.js",
    "chunk-7AAP2OSY.js",
    "chunk-Q66F7AEW.js",
    "chunk-N25AGC6Y.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/bussines/roles/roles.component.ts": [
    "chunk-5R64QXNL.js",
    "chunk-TAZLO56O.js",
    "chunk-Q66F7AEW.js",
    "chunk-N25AGC6Y.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/bussines/users/users.component.ts": [
    "chunk-35J7I5HU.js",
    "chunk-OOY6EHW7.js",
    "chunk-RYVWLOFT.js",
    "chunk-QHMR3ZOF.js",
    "chunk-7AAP2OSY.js",
    "chunk-Q66F7AEW.js",
    "chunk-N25AGC6Y.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/bussines/permission/permission.component.ts": [
    "chunk-6OCMNJFS.js",
    "chunk-RYVWLOFT.js",
    "chunk-QHMR3ZOF.js",
    "chunk-7AAP2OSY.js",
    "chunk-Q66F7AEW.js",
    "chunk-N25AGC6Y.js",
    "chunk-TCNXVZO5.js"
  ],
  "src/app/bussines/mail/mail.component.ts": [
    "chunk-YPEZQXV3.js",
    "chunk-N25AGC6Y.js",
    "chunk-TCNXVZO5.js"
  ]
},
  assets: {
    'index.csr.html': {size: 11381, hash: '7b7f7d19f20f36a28770077514db03fb60128da8ee6047760479c0245a8d0a77', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 10194, hash: 'df8428b7386e8d50a6210715ee25bc34a7d064099922fa541c370efe4b455cd3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-YU427LYH.css': {size: 46348, hash: '8M1k1IUHmr0', text: () => import('./assets-chunks/styles-YU427LYH_css.mjs').then(m => m.default)}
  },
};
