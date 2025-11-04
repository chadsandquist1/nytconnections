/**
 * Mock odds data for development
 * This represents HTML from Gamblers Palace
 */

export function getOddsMock() {
  return `
    <html>
      <body>
        <div>NFL Odds - Week 10</div>
        <table>
          <tr><td>MIN</td><td>+3</td><td>GB</td><td>-3</td></tr>
          <tr><td>DET</td><td>-7</td><td>DAL</td><td>+7</td></tr>
          <tr><td>KC</td><td>-5.5</td><td>BUF</td><td>+5.5</td></tr>
          <tr><td>LAR</td><td>+3.5</td><td>PHI</td><td>-3.5</td></tr>
          <tr><td>SF</td><td>-6</td><td>BAL</td><td>+6</td></tr>
          <tr><td>LAC</td><td>+4.5</td><td>MIA</td><td>-4.5</td></tr>
          <tr><td>TB</td><td>+2.5</td><td>TEN</td><td>-2.5</td></tr>
          <tr><td>CIN</td><td>+3</td><td>PIT</td><td>-3</td></tr>
        </table>
      </body>
    </html>
  `;
}
