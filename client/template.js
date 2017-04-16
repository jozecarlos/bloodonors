
export default ({ body, title, initialState }) => {
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);
  return `
    <!doctype html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
          <link rel="stylesheet" href="https://js.arcgis.com/4.3/esri/css/main.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.min.css">
          <link rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
            integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
            crossorigin="anonymous">
          ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        </head>
        <body style='margin: 0' class="sassy-theme">
          <div id="root">${process.env.NODE_ENV === 'production' ? body : `<div>${body}</div>`}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
            ${process.env.NODE_ENV === 'production' ?
            `//<![CDATA[
            window.webpackManifest = ${JSON.stringify(chunkManifest)};
            //]]>` : ''}
          </script>
          <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
          <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
        </body>
      </html>
  `;
};
