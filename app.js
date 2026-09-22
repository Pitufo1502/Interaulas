```javascript
// ======================================================
// INTERAULAS 2026
// APP.JS
// ======================================================


// ======================================================
// SUPABASE
// ======================================================

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ======================================================
// EQUIPOS
// ======================================================

const MEN_A = [
  "Fortnite",
  "Papitos",
  "Trocos",
  "Chifladitos",
  "Chispazos"
];

const MEN_B = [
  "Sin Espinas",
  "Osos Mañosos",
  "Motoneta",
  "La Banca",
  "TOROS FC"
];

const WOMEN = [
  "Ponys",
  "Jags",
  "Osas Mañosas",
  "Innombrables",
  "Troncas",
  "Las Cabritas"
];


// ======================================================
// FECHAS DE LOS PARTIDOS
//
// IMPORTANTE:
// El número del partido NO determina el orden.
// El calendario se ordena usando MATCH_DATE_VALUES.
// ======================================================

const MATCH_DATES = {

  1: "7 de septiembre",
  2: "8 de septiembre",
  3: "9 de septiembre",
  4: "10 de septiembre",

  5: "16 de septiembre",
  6: "17 de septiembre",
  7: "18 de septiembre",

  // Mujeres movidas
  8: "23 de septiembre",

  // Hombres
  9: "22 de septiembre",

  // Mujeres
  10: "24 de septiembre",

  // Hombres
  11: "25 de septiembre",

  // Mujeres
  12: "28 de septiembre",

  // Hombres
  13: "29 de septiembre",

  // Mujeres
  14: "30 de septiembre",

  // Hombres
  15: "1 de octubre",

  // Mujeres
  16: "2 de octubre",

  // Hombres
  17: "5 de octubre",

  // Mujeres
  18: "6 de octubre",

  // Hombres
  19: "7 de octubre",

  // Mujeres
  20: "8 de octubre",

  // Hombres
  21: "9 de octubre",

  // Mujeres
  22: "12 de octubre",

  // Hombres
  23: "13 de octubre",

  // Mujeres
  24: "14 de octubre",

  // Hombres
  25: "15 de octubre",

  // Mujeres
  26: "16 de octubre",

  // Hombres
  27: "21 de octubre",

  // Mujeres
  28: "22 de octubre",

  // Hombres
  29: "23 de octubre",

  // Mujeres
  30: "26 de octubre",

  // Hombres
  31: "27 de octubre",

  // Hombres
  32: "28 de octubre",

  // Hombres
  33: "30 de octubre",

  // Hombres
  34: "2 de noviembre",

  // Hombres
  35: "3 de noviembre"

};


// ======================================================
// FECHA NUMÉRICA REAL
// ======================================================

const MATCH_DATE_VALUES = {

  1: "2026-09-07",
  2: "2026-09-08",
  3: "2026-09-09",
  4: "2026-09-10",

  5: "2026-09-16",
  6: "2026-09-17",
  7: "2026-09-18",

  9: "2026-09-22",
  8: "2026-09-23",

  10: "2026-09-24",
  11: "2026-09-25",

  12: "2026-09-28",
  13: "2026-09-29",
  14: "2026-09-30",

  15: "2026-10-01",
  16: "2026-10-02",

  17: "2026-10-05",
  18: "2026-10-06",

  19: "2026-10-07",
  20: "2026-10-08",

  21: "2026-10-09",
  22: "2026-10-12",

  23: "2026-10-13",
  24: "2026-10-14",

  25: "2026-10-15",
  26: "2026-10-16",

  27: "2026-10-21",
  28: "2026-10-22",

  29: "2026-10-23",
  30: "2026-10-26",

  31: "2026-10-27",
  32: "2026-10-28",

  33: "2026-10-30",

  34: "2026-11-02",

  35: "2026-11-03"

};


// ======================================================
// ALIASES
// ======================================================

const ALIASES = {

  "Finqueros": "Chispazos",

  "Chapiadoras.com": "Innombrables",

  "Tan G Neras FC": "Ponys",

  "TNG FC": "Ponys",

  "Razitos": "TOROS FC",

  "Sin Esquinas": "Sin Espinas",

  "Trocas": "Troncas"

};


// ======================================================
// VARIABLES
// ======================================================

let session = null;

let editingMatchId = null;


// ======================================================
// INICIO
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupButtons();

    await checkSession();

    await refresh();

  }
);


// ======================================================
// BOTONES
// ======================================================

function setupButtons() {

  const loginBtn =
    document.getElementById("loginBtn");


  if (loginBtn) {

    loginBtn.addEventListener(
      "click",
      () => {

        if (session) {

          logout();

        } else {

          openModal("authModal");

        }

      }
    );

  }


  const addSanctionBtn =
    document.getElementById("addSanctionBtn");


  if (addSanctionBtn) {

    addSanctionBtn.addEventListener(
      "click",
      addSanction
    );

  }


  const addScorerBtn =
    document.getElementById("addScorerBtn");


  if (addScorerBtn) {

    addScorerBtn.addEventListener(
      "click",
      addScorer
    );

  }

}


// ======================================================
// MODALES
// ======================================================

function openModal(id) {

  const modal =
    document.getElementById(id);


  if (modal) {

    modal.classList.remove("hidden");

  }

}


function closeModal(id) {

  const modal =
    document.getElementById(id);


  if (modal) {

    modal.classList.add("hidden");

  }

}


// ======================================================
// AUTENTICACIÓN
// ======================================================

async function checkSession() {

  const { data } =
    await db.auth.getSession();


  session = data.session;

  updateAuthUI();


  db.auth.onAuthStateChange(
    async (_event, newSession) => {

      session = newSession;

      updateAuthUI();

      await refresh();

    }
  );

}


function updateAuthUI() {

  const loginBtn =
    document.getElementById("loginBtn");

  const addSanctionBtn =
    document.getElementById("addSanctionBtn");

  const addScorerBtn =
    document.getElementById("addScorerBtn");


  if (loginBtn) {

    loginBtn.textContent =
      session
        ? "Cerrar sesión"
        : "Iniciar sesión";

  }


  if (addSanctionBtn) {

    addSanctionBtn.classList.toggle(
      "hidden",
      !session
    );

  }


  if (addScorerBtn) {

    addScorerBtn.classList.toggle(
      "hidden",
      !session
    );

    addScorerBtn.style.display =
      session
        ? "inline-block"
        : "none";

  }

}


async function login() {

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  const message =
    document.getElementById("authMessage");


  if (!email || !password) {

    message.textContent =
      "Escribe tu correo y contraseña.";

    return;

  }


  const { data, error } =
    await db.auth.signInWithPassword({

      email,
      password

    });


  if (error) {

    message.textContent =
      error.message;

    return;

  }


  session = data.session;

  closeModal("authModal");

  updateAuthUI();

  await refresh();

}


async function logout() {

  await db.auth.signOut();

  session = null;

  updateAuthUI();

  await refresh();

}


// ======================================================
// REFRESH
// ======================================================

async function refresh() {

  await Promise.all([

    renderTables(),

    renderMatches(),

    renderSanctions(),

    renderScorers(),

    renderNext(),

    renderCleanliness()

  ]);

}


// ======================================================
// NORMALIZAR EQUIPO
// ======================================================

function normalizeTeam(team) {

  return ALIASES[team] || team;

}


// ======================================================
// ESTADÍSTICAS
// ======================================================

function stats(
  teams,
  matches,
  adjustments = []
) {

  const data = {};


  teams.forEach(team => {

    data[team] = {

      team,

      played: 0,

      wins: 0,

      draws: 0,

      losses: 0,

      gf: 0,

      ga: 0,

      gd: 0,

      points: 0

    };

  });


  matches.forEach(match => {

    if (
      match.home_score === null ||
      match.away_score === null
    ) {

      return;

    }


    const home =
      normalizeTeam(match.home_team);

    const away =
      normalizeTeam(match.away_team);


    if (
      !data[home] ||
      !data[away]
    ) {

      return;

    }


    const hs =
      Number(match.home_score);

    const as =
      Number(match.away_score);


    data[home].played++;
    data[away].played++;

    data[home].gf += hs;
    data[home].ga += as;

    data[away].gf += as;
    data[away].ga += hs;


    if (hs > as) {

      data[home].wins++;
      data[away].losses++;
      data[home].points += 3;

    }

    else if (hs < as) {

      data[away].wins++;
      data[home].losses++;
      data[away].points += 3;

    }

    else {

      data[home].draws++;
      data[away].draws++;

      data[home].points++;
      data[away].points++;

    }

  });


  Object.values(data).forEach(team => {

    team.gd =
      team.gf - team.ga;

  });


  adjustments.forEach(adjustment => {

    const team =
      normalizeTeam(adjustment.team);


    if (data[team]) {

      data[team].points +=
        Number(adjustment.points || 0);

    }

  });


  return Object.values(data).sort((a, b) => {

    if (b.points !== a.points) {

      return b.points - a.points;

    }

    if (b.gd !== a.gd) {

      return b.gd - a.gd;

    }

    return b.gf - a.gf;

  });

}


// ======================================================
// TABLA HTML
// ======================================================

function tableHTML(
  title,
  teams,
  matches,
  adjustments
) {

  const rows =
    stats(
      teams,
      matches,
      adjustments
    );


  return `

    <div class="card">

      <h3>${title}</h3>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>DG</th>
              <th>Pts</th>

              ${
                session
                  ? "<th></th>"
                  : ""
              }

            </tr>

          </thead>

          <tbody>

            ${
              rows.map(
                (row, index) => `

                  <tr>

                    <td>${index + 1}</td>

                    <td>
                      <strong>
                        ${row.team}
                      </strong>
                    </td>

                    <td>${row.played}</td>

                    <td>${row.wins}</td>

                    <td>${row.draws}</td>

                    <td>${row.losses}</td>

                    <td>
                      ${
                        row.gd > 0
                          ? "+"
                          : ""
                      }${row.gd}
                    </td>

                    <td>
                      <strong>
                        ${row.points}
                      </strong>
                    </td>

                    ${
                      session
                        ? `

                          <td>

                            <button
                              class="outline"
                              onclick="editTeamPoints('${row.team}')"
                            >
                              ✏️
                            </button>

                          </td>

                        `
                        : ""
                    }

                  </tr>

                `
              ).join
```
