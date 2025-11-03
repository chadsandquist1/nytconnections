/**
 * Mock MyFantasyLeague schedule data for development
 * This represents the XML format from MFL API
 */

export function getMflScheduleMock(week) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<nflSchedule>
  <matchup gameSecondsRemaining="0">
    <team id="MIN" score="21" isHome="0" spread="-3.0"/>
    <team id="GB" score="24" isHome="1" spread="3.0"/>
  </matchup>
  <matchup gameSecondsRemaining="0">
    <team id="DET" score="31" isHome="0" spread="-7.0"/>
    <team id="DAL" score="20" isHome="1" spread="7.0"/>
  </matchup>
  <matchup gameSecondsRemaining="1800">
    <team id="KC" score="14" isHome="0" spread="-5.5"/>
    <team id="BUF" score="10" isHome="1" spread="5.5"/>
  </matchup>
  <matchup gameSecondsRemaining="2700">
    <team id="PHI" score="7" isHome="1" spread="-3.5"/>
    <team id="LAR" score="3" isHome="0" spread="3.5"/>
  </matchup>
  <matchup gameSecondsRemaining="3600">
    <team id="SF" score="0" isHome="0" spread="-6.0"/>
    <team id="BAL" score="0" isHome="1" spread="6.0"/>
  </matchup>
  <matchup gameSecondsRemaining="3600">
    <team id="MIA" score="0" isHome="1" spread="-4.5"/>
    <team id="LAC" score="0" isHome="0" spread="4.5"/>
  </matchup>
  <matchup gameSecondsRemaining="3600">
    <team id="TB" score="0" isHome="0" spread="2.5"/>
    <team id="TEN" score="0" isHome="1" spread="-2.5"/>
  </matchup>
  <matchup gameSecondsRemaining="3600">
    <team id="PIT" score="0" isHome="1" spread="-3.0"/>
    <team id="CIN" score="0" isHome="0" spread="3.0"/>
  </matchup>
</nflSchedule>`;
}
