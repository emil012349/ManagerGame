import React, { useState, useEffect } from "react";

// Teams + einfache Logos (du kannst die URLs ersetzen)
const teams = [
  {
    name: "FC Bayern",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/1f/FC_Bayern_München_logo_(2017).svg",
  },
  {
    name: "Borussia Dortmund",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
  },
  {
    name: "RB Leipzig",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg",
  },
  {
    name: "Bayer Leverkusen",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Bayer_04_Leverkusen_logo.svg",
  },
  {
    name: "VfB Stuttgart",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/91/VfB_Stuttgart_Logo.svg",
  },
  {
    name: "Eintracht Frankfurt",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/d1/Eintracht_Frankfurt_Logo.svg",
  },
  {
    name: "SC Freiburg",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/58/SC_Freiburg_logo.svg",
  },
  {
    name: "TSG Hoffenheim",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/fb/TSG_Hoffenheim_logo.svg",
  },
  {
    name: "Werder Bremen",
    logo: "https://upload.wikimedia.org/wikipedia/en/6/68/SV_Werder_Bremen_logo.svg",
  },
  {
    name: "1. FC Heidenheim",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/c4/1._FC_Heidenheim_logo.svg",
  },
  {
    name: "FC Augsburg",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/9b/FC_Augsburg_logo.svg",
  },
  {
    name: "VfL Wolfsburg",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/9f/VfL_Wolfsburg_logo.svg",
  },
  {
    name: "Borussia Mönchengladbach",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/f3/Borussia_Mönchengladbach_logo.svg",
  },
  {
    name: "1. FC Union Berlin",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/9e/1._FC_Union_Berlin_logo.svg",
  },
  {
    name: "1. FSV Mainz 05",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/12/1._FSV_Mainz_05_logo.svg",
  },
  {
    name: "VfL Bochum",
    logo: "https://upload.wikimedia.org/wikipedia/en/8/8a/VfL_Bochum_logo.svg",
  },
  {
    name: "1. FC Köln",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/fb/1._FC_Köln_Logo.svg",
  },
  {
    name: "Darmstadt 98",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/fc/SV_Darmstadt_98_logo.svg",
  },
];

// Random Player Faces API (via robohash)
function generatePlayerFace(name) {
  return `https://robohash.org/${encodeURIComponent(name)}?set=set4&size=50x50`;
}

// Spieler Namen Generator (Beispiel)
const firstNames = [
  "Lukas",
  "Max",
  "Tobias",
  "Felix",
  "Jonas",
  "Paul",
  "Leon",
  "Jan",
  "Finn",
  "Tim",
];
const lastNames = [
  "Müller",
  "Schmidt",
  "Schneider",
  "Fischer",
  "Weber",
  "Meyer",
  "Wagner",
  "Becker",
  "Hoffmann",
  "Schulz",
];

function randomName() {
  const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
  const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${fn} ${ln}`;
}

// Vollständiger Spielplan (Hin- und Rückrunde)
function createFullSchedule(teams) {
  let schedule = [];
  const n = teams.length;
  let rotTeams = teams.map((t) => t.name);

  for (let round = 0; round < n - 1; round++) {
    let matches = [];
    for (let i = 0; i < n / 2; i++) {
      let home, away;
      if (i === 0 && round % 2 === 1) {
        home = rotTeams[n - 1];
        away = rotTeams[0];
      } else {
        home = rotTeams[i];
        away = rotTeams[n - 1 - i];
      }
      matches.push({ home, away });
    }
    schedule.push(matches);
    rotTeams.splice(1, 0, rotTeams.pop());
  }
  const secondHalf = schedule.map((round) =>
    round.map((match) => ({ home: match.away, away: match.home }))
  );

  return [...schedule, ...secondHalf];
}

export default function App() {
  // === States ===
  const [menu, setMenu] = useState("createCoach");
  const [coach, setCoach] = useState({ name: "", nationality: "" });
  const [playerTeam, setPlayerTeam] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [matchDay, setMatchDay] = useState(0);
  const [table, setTable] = useState({});
  const [season, setSeason] = useState(1);
  const [squad, setSquad] = useState([]);
  const [budget, setBudget] = useState(50000000);
  const [transferList, setTransferList] = useState([]);
  const [message, setMessage] = useState("");

  // === Initialisiere Tabelle ===
  const initTable = () => {
    const obj = {};
    teams.forEach((t) => {
      obj[t.name] = { points: 0, games: 0, goalsFor: 0, goalsAgainst: 0 };
    });
    return obj;
  };

  // === Erstelle Spieler für Team ===
  function createPlayers(teamName) {
    const players = [];
    for (let i = 0; i < 18; i++) {
      const name = randomName();
      players.push({
        id: `${teamName}-${i}`,
        name,
        face: generatePlayerFace(name),
        position: ["Torwart", "Verteidiger", "Mittelfeld", "Sturm"][
          Math.floor(Math.random() * 4)
        ],
        skill: Math.floor(Math.random() * 100) + 1,
      });
    }
    return players;
  }

  // === Coach erstellen und Team wählen ===
  const handleCreateCoach = () => {
    if (coach.name.trim() && coach.nationality.trim()) {
      setMenu("chooseTeam");
    } else {
      alert("Bitte gib Name und Nationalität ein.");
    }
  };

  const handleChooseTeam = (teamName) => {
    setPlayerTeam(teamName);
    setSchedule(createFullSchedule(teams));
    setTable(initTable());
    setSquad(createPlayers(teamName));
    setMatchDay(0);
    setMenu("season");
  };

  // === Simuliere ein Match (realistischer) ===
  function simulateGame(homeTeam, awayTeam) {
    // Erhöhe Skill basierte Chancen
    const homeSkill = 50 + Math.random() * 50;
    const awaySkill = 50 + Math.random() * 50;

    // Simuliere Tore (0-5)
    let homeGoals = 0;
    let awayGoals = 0;

    // Mehr Skill = höhere Wahrscheinlichkeit für Tore
    for (let i = 0; i < 5; i++) {
      if (Math.random() * 100 < homeSkill) homeGoals++;
      if (Math.random() * 100 < awaySkill) awayGoals++;
    }

    // Max 5 Tore pro Team
    homeGoals = Math.min(homeGoals, 5);
    awayGoals = Math.min(awayGoals, 5);

    return { homeGoals, awayGoals };
  }

  // === Spieltag simulieren (alle Spiele) ===
  const simulateMatchDay = () => {
    if (matchDay >= schedule.length) return;

    let newTable = { ...table };

    schedule[matchDay].forEach(({ home, away }) => {
      const { homeGoals, awayGoals } = simulateGame(home, away);

      newTable[home].games++;
      newTable[away].games++;
      newTable[home].goalsFor += homeGoals;
      newTable[home].goalsAgainst += awayGoals;
      newTable[away].goalsFor += awayGoals;
      newTable[away].goalsAgainst += homeGoals;

      if (homeGoals > awayGoals) {
        newTable[home].points += 3;
      } else if (homeGoals === awayGoals) {
        newTable[home].points += 1;
        newTable[away].points += 1;
      } else {
        newTable[away].points += 3;
      }
    });

    setTable(newTable);
    setMatchDay(matchDay + 1);

    // Wenn Saison vorbei
    if (matchDay + 1 === schedule.length) {
      setMessage(
        `Saison ${season} beendet! Dein Team hat Platz ${
          Object.entries(newTable)
            .sort((a, b) => b[1].points - a[1].points)
            .findIndex(([team]) => team === playerTeam) + 1
        } erreicht.`
      );
      setMenu("seasonEnd");
    }
  };

  // === Transfermarkt erzeugen ===
  const generateTransferPlayers = () => {
    const players = [];
    for (let i = 0; i < 10; i++) {
      const name = randomName();
      players.push({
        id: `transfer-${i}`,
        name,
        face: generatePlayerFace(name),
        position: ["Torwart", "Verteidiger", "Mittelfeld", "Sturm"][
          Math.floor(Math.random() * 4)
        ],
        skill: Math.floor(Math.random() * 100) + 1,
        price: Math.floor(Math.random() * 10000000) + 1000000,
      });
    }
    setTransferList(players);
  };

  useEffect(() => {
    if (menu === "transfers") generateTransferPlayers();
  }, [menu]);

  // === Spieler kaufen ===
  const buyPlayer = (player) => {
    if (budget >= player.price) {
      setSquad([...squad, player]);
      setBudget(budget - player.price);
      setTransferList(transferList.filter((p) => p.id !== player.id));
      alert(`Spieler ${player.name} gekauft!`);
    } else {
      alert("Nicht genug Budget!");
    }
  };

  // === Saison neu starten ===
  const newSeason = () => {
    setSeason(season + 1);
    setSchedule(createFullSchedule(teams));
    setTable(initTable());
    setMatchDay(0);
    setMessage("");
    setMenu("season");
  };

  // === Tabelle sortieren ===
  const sortedTable = Object.entries(table).sort((a, b) => {
    const p = b[1].points - a[1].points;
    if (p !== 0) return p;
    // Tordifferenz
    return (
      b[1].goalsFor - b[1].goalsAgainst - (a[1].goalsFor - a[1].goalsAgainst)
    );
  });

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "20px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <h1 style={{ color: "#004d99", textAlign: "center" }}>
        Dein Bundesliga Manager
      </h1>

      {/* Menü: Trainer erstellen */}
      {menu === "createCoach" && (
        <div
          style={{ padding: 20, backgroundColor: "#f0f8ff", borderRadius: 8 }}
        >
          <h2>Trainer erstellen</h2>
          <input
            placeholder="Name"
            value={coach.name}
            onChange={(e) => setCoach({ ...coach, name: e.target.value })}
            style={{
              padding: 10,
              margin: 10,
              fontSize: 16,
              width: "calc(100% - 40px)",
            }}
          />
          <input
            placeholder="Nationalität"
            value={coach.nationality}
            onChange={(e) =>
              setCoach({ ...coach, nationality: e.target.value })
            }
            style={{
              padding: 10,
              margin: 10,
              fontSize: 16,
              width: "calc(100% - 40px)",
            }}
          />
          <button
            onClick={handleCreateCoach}
            style={{
              padding: "10px 20px",
              marginTop: 10,
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Weiter
          </button>
        </div>
      )}

      {/* Menü: Team auswählen */}
      {menu === "chooseTeam" && (
        <div style={{ padding: 20 }}>
          <h2>Wähle dein Team</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
            {teams.map((t) => (
              <button
                key={t.name}
                onClick={() => handleChooseTeam(t.name)}
                style={{
                  flex: "1 0 150px",
                  padding: 10,
                  cursor: "pointer",
                  borderRadius: 8,
                  border: "2px solid #007bff",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  fontWeight: "bold",
                }}
              >
                <img
                  src={t.logo}
                  alt={t.name}
                  style={{ width: 50, height: 50 }}
                />
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saison Anzeige */}
      {menu === "season" && (
        <div style={{ padding: 20 }}>
          <h2>Saison {season}</h2>
          <h3>Team: {playerTeam}</h3>
          <button
            onClick={() => setMenu("transfers")}
            style={{
              marginBottom: 15,
              padding: "8px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Zum Transfermarkt
          </button>
          <h4>
            Spieltag {matchDay + 1} von {schedule.length}
          </h4>
          <button
            onClick={simulateMatchDay}
            style={{
              padding: "10px 20px",
              marginBottom: 20,
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Spieltag simulieren
          </button>

          {/* Aktuelle Spiele */}
          <div
            style={{
              maxHeight: 200,
              overflowY: "auto",
              marginBottom: 20,
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 10,
            }}
          >
            {matchDay < schedule.length ? (
              schedule[matchDay].map(({ home, away }, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <img
                      src={teams.find((t) => t.name === home).logo}
                      alt={home}
                      style={{ width: 25, height: 25 }}
                    />
                    <strong>{home}</strong>
                  </div>
                  <span>vs</span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <img
                      src={teams.find((t) => t.name === away).logo}
                      alt={away}
                      style={{ width: 25, height: 25 }}
                    />
                    <strong>{away}</strong>
                  </div>
                </div>
              ))
            ) : (
              <p>Keine Spiele mehr diese Saison</p>
            )}
          </div>

          {/* Tabelle */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <thead style={{ backgroundColor: "#007bff", color: "white" }}>
              <tr>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>#</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Team</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Sp.</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>S</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>U</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>N</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Tore</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Diff.</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Pkt.</th>
              </tr>
            </thead>
            <tbody>
              {sortedTable.map(([teamName, stats], idx) => {
                const wins = Math.floor(stats.points / 3);
                const draws = stats.points % 3;
                const losses = stats.games - wins - draws;
                return (
                  <tr
                    key={teamName}
                    style={{
                      backgroundColor:
                        teamName === playerTeam ? "#d1e7fd" : "white",
                    }}
                  >
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <img
                        src={teams.find((t) => t.name === teamName)?.logo}
                        alt={teamName}
                        style={{ width: 25, height: 25 }}
                      />
                      {teamName}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {stats.games}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {wins}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {draws}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {losses}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {stats.goalsFor} : {stats.goalsAgainst}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {stats.goalsFor - stats.goalsAgainst}
                    </td>
                    <td
                      style={{
                        padding: 6,
                        border: "1px solid #ddd",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {stats.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginBottom: 20 }}>
            <strong>Budget:</strong> {budget.toLocaleString("de-DE")} €
          </div>
        </div>
      )}

      {/* Transfermarkt */}
      {menu === "transfers" && (
        <div style={{ padding: 20 }}>
          <h2>Transfermarkt</h2>
          <button
            onClick={() => setMenu("season")}
            style={{
              marginBottom: 15,
              padding: "8px 15px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Zurück zur Saison
          </button>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
            {transferList.map((player) => (
              <div
                key={player.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 10,
                  width: 180,
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <img
                  src={player.face}
                  alt={player.name}
                  style={{ borderRadius: "50%", marginBottom: 10 }}
                />
                <div style={{ fontWeight: "bold" }}>{player.name}</div>
                <div>Position: {player.position}</div>
                <div>Skill: {player.skill}</div>
                <div>Preis: {player.price.toLocaleString("de-DE")} €</div>
                <button
                  onClick={() => buyPlayer(player)}
                  style={{
                    marginTop: 10,
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  Kaufen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saison Ende */}
      {menu === "seasonEnd" && (
        <div style={{ padding: 20, textAlign: "center" }}>
          <h2>Saison beendet</h2>
          <p>{message}</p>
          <button
            onClick={newSeason}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              marginRight: 10,
            }}
          >
            Neue Saison starten
          </button>
          <button
            onClick={() => setMenu("transfers")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Zum Transfermarkt
          </button>
        </div>
      )}
    </div>
  );
}
