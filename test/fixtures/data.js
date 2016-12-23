module.exports = {
  defaultBaseUrl: 'https://onionoo.torproject.org',
  defaultEndpoints: [
    'summary',
    'details',
    'bandwidth',
    'weights',
    'clients',
    'uptime'
  ],
  dummyResponse: {
    version: '3.1',
    relays_published: '2016-12-22 06:00:00',
    relays: [
      {
        n: 'FelixIO',
        f: '95C6C5F65BFC7C06DDD765015E617853BA993C94',
        a: [
          '87.118.92.43'
        ],
        r: true
      }
    ],
    bridges_published: '2016-12-22 04:41:03',
    bridges: []
  },
  dummy400Response: '<html>\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"/>\n<title>Error 400 Bad Request</title>\n</head>\n<body><h2>HTTP ERROR 400</h2>\n<p>Problem accessing /summary. Reason:\n<pre>    Bad Request</pre></p><hr /><i><small>Powered by Jetty://</small></i><br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n<br/>                                                \n\n</body>\n</html>'
}
