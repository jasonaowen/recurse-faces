import React from 'react';

const heart = (<span role="img" aria-label="heart">❤️</span>);
const scoutUrl = "https://www.recurse.com/scout/click?t=ac9449867495df95991da39e95823b65";
const sourceUrl = "https://github.com/jasonaowen/recurse-faces";

export const Footer = () => (
  <footer className="footer">
    Made with {heart} with and for the <a href={scoutUrl}>Recurse Center</a> community.
    (<a href={sourceUrl}>Source</a>)
  </footer>
);
