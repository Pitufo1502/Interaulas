const { createClient } = window.supabase;

const configured =
  SUPABASE_URL.startsWith("http") &&
  !SUPABASE_ANON_KEY.includes("PEGA_AQUI");

const db = configured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;


// ============================================
// EQUIPOS OFICIALES 2026
// ============================================

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

const ALL_TEAMS = [
  ...MEN_A,
  ...MEN_B,
  ...WOMEN
];


// ============================================
// FECHAS OFICIALES
// ============================================

const MATCH_DATES = {
  1: "7 de septiembre",
  2: "8 de septiembre",
  3: "9 de septiembre",
  4: "10 de septiembre",
  5: "16 de septiembre",
  6: "17 de septiembre",
  7: "18 de septiembre",
  8: "21 de septiembre",
  9: "22 de septiembre",
  10: "23 de septiembre",
  11: "24 de septiembre",
  12: "25 de septiembre",
  13: "28 de septiembre",
  14: "29 de septiembre",
  15: "30 de septiembre",
  16: "1 de octubre",
  17: "5 de octubre",
  18: "6 de octubre",
  19: "7 de octubre",
  20: "8 de octubre",
  21: "9 de octubre",
  22: "12 de octubre",
  23: "13 de octubre",
  24: "14 de octubre",
  25: "15 de octubre",
  26: "16 de octubre",
  27: "21 de octubre",
  28: "22 de octubre",
  29: "23 de octubre",
  30: "26 de octubre",
  31: "27 de octubre",
  32: "28 de octubre",
  33: "30 de octubre",
  34: "2 de noviembre",
  35: "3 de noviembre"
};


// ============================================
// NOMBRES ANTIGUOS → NOMBRES OFICIALES
// ============================================

const TEAM_ALIASES = {
  "Finqueros": "Chispazos",
  "Chapiadoras.com": "Innombrables",
  "Tan G Neras FC": "Ponys",
  "Razitos": "TOROS FC",
  "Sin Esquinas": "Sin Espinas",
  "Trocas": "Troncas"
};


function officialTeamName(team) {
  return TEAM_ALIASES[team] || team;
}


let session = null;


// ============================================
// INICIO
// ============================================

document.addEventListener("DOMContentLoaded", async () => {

  const loginBtn = document.getElementById("loginBtn");
  const authAction = document.getElementById("authAction");
  const addSanctionBtn = document.getElementById("addSanctionBtn");
  const addScorerBtn = document.getElementById("addScorerBtn");

  if (loginBtn) {
    loginBtn.onclick = openModal;
  }

  if (authAction) {
    authAction.onclick = auth;
  }

  if (addSanctionBtn) {
    addSanctionBtn.onclick = openSanctionForm;
  }

  if (addScorerBtn) {
    addScorerBtn.onclick = openScorerForm;
  }

  await refresh();

});

// ============================================
// MODALES
// ============================================

function openModal() {
  document
    .getElementById("authModal")
    .classList.remove("hidden");
}

function closeModal() {
  document
    .getElementById("authModal")
    .classList.add("hidden");
}

function closeEdit() {
  document
    .getElementById("editModal")
    .classList.add("hidden");
}


// ============================================
// REFRESH GENERAL
// ============================================

async function refresh() {

  if (!db) {
    renderDemo();
    return;
  }

  const { data } = await db.auth.getSession();

  session = data.session;

  setEditorUI();

  await Promise.all([
    renderTables(),
    renderMatches(),
    renderSanctions(),
    renderScorers(),
    renderNext()
  ]);
}


// ============================================
// UI ORGANIZADORES
// ============================================

function setEditorUI() {

  const loginButton = document.getElementById("loginBtn");

  if (loginButton) {
    loginButton.textContent = session
      ? "Cerrar sesión"
      : "Iniciar sesión";

    loginButton.onclick = session
      ? logout
      : openModal;
  }

  const scorerButton =
    document.getElementById("addScorerBtn");

  if (scorerButton) {
    scorerButton.classList.remove("hidden");
    scorerButton.style.display = "inline-block";
    scorerButton.onclick = openScorerForm;
  }

  const sanctionButton =
    document.getElementById("addSanctionBtn");

 if (sanctionButton) {
  sanctionButton.classList.toggle(
    "hidden",
    !session
  );

  sanctionButton.onclick = openSanctionForm;
}

}

// ============================================
// LOGIN
// ============================================

async function auth() {

  if (!db) return;

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  const r =
    await db.auth.signInWithPassword({
      email,
      password
    });


  document.getElementById("authMsg").textContent =
    r.error
      ? r.error.message
      : "Acceso correcto";


  if (!r.error) {

    session = r.data.session;

    closeModal();

    setEditorUI();

    await refresh();

  }

}


// ============================================
// LOGOUT
// ============================================

async function logout() {

  if (!db) return;

  await db.auth.signOut();

  session = null;

  setEditorUI();

  await refresh();

}


// ============================================
// ESTADÍSTICAS
// ============================================

function stats(teams, matches) {

  return teams
    .map(team => {

      const x = {
        team,
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        gf: 0,
        gc: 0,
        pts: 0
      };


      matches
        .filter(m => {

          const home =
            officialTeamName(m.home_team);

          const away =
            officialTeamName(m.away_team);

          return (
            home === team ||
            away === team
          );

        })
        .forEach(m => {

          if (
            m.home_score == null ||
            m.away_score == null
          ) {
            return;
          }


          const homeTeam =
            officialTeamName(m.home_team);

          const awayTeam =
            officialTeamName(m.away_team);


          const isHome =
            homeTeam === team;


          const goalsFor =
            isHome
              ? Number(m.home_score)
              : Number(m.away_score);


          const goalsAgainst =
            isHome
              ? Number(m.away_score)
              : Number(m.home_score);


          x.pj++;

          x.gf += goalsFor;

          x.gc += goalsAgainst;


          if (goalsFor > goalsAgainst) {

            x.pg++;
            x.pts += 3;

          } else if (goalsFor === goalsAgainst) {

            x.pe++;
            x.pts++;

          } else {

            x.pp++;

          }

        });


      x.dg = x.gf - x.gc;

      return x;

    })


    .sort(
      (a, b) =>
        b.pts - a.pts ||
        b.dg - a.dg ||
        b.gf - a.gf
    );

}


// ============================================
// HTML TABLA
// ============================================

function tableHTML(title, data) {

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
              <th>PG</th>
              <th>PE</th>
              <th>PP</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>PTS</th>
            </tr>
          </thead>

          <tbody>

            ${
              data
                .map(
                  (x, i) => `
                    <tr>

                      <td class="rank">
                        ${i + 1}
                      </td>

                      <td>
                        <strong>
                          ${x.team}
                        </strong>
                      </td>

                      <td>${x.pj}</td>
                      <td>${x.pg}</td>
                      <td>${x.pe}</td>
                      <td>${x.pp}</td>
                      <td>${x.gf}</td>
                      <td>${x.gc}</td>

                      <td>
                        ${
                          x.dg > 0
                            ? "+"
                            : ""
                        }${x.dg}
                      </td>

                      <td class="pts">
                        ${x.pts}
                      </td>

                    </tr>
                  `
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>
  `;

}


// ============================================
// OBTENER PARTIDOS
// ============================================

async function getMatches() {

  const { data, error } =
    await db
      .from("matches")
      .select("*")
      .order("day", {
        ascending: true
      });


  if (error) {

    console.error(error);

    return [];

  }


  return (data || []).map(match => ({

    ...match,

    home_team:
      officialTeamName(match.home_team),

    away_team:
      officialTeamName(match.away_team)

  }));

}


// ============================================
// TABLAS DE POSICIONES
// ============================================

async function renderTables() {

  const matches =
    await getMatches();


  document.getElementById("menTables").innerHTML =

    tableHTML(
      "Grupo A",
      stats(
        MEN_A,
        matches.filter(
          m =>
            m.gender === "M" &&
            m.group_name === "A"
        )
      )
    )


    +

    tableHTML(
      "Grupo B",
      stats(
        MEN_B,
        matches.filter(
          m =>
            m.gender === "M" &&
            m.group_name === "B"
        )
      )
    );


  document.getElementById("womenTable").innerHTML =

    tableHTML(
      "Grupo único · Los 4 mejores avanzan",
      stats(
        WOMEN,
        matches.filter(
          m =>
            m.gender === "F"
        )
      )
    );

}


// ============================================
// PARTIDOS
// ============================================

async function renderMatches() {

  const matches =
    await getMatches();


  const days = {};


  matches.forEach(match => {

    if (!days[match.day]) {
      days[match.day] = [];
    }

    days[match.day].push(match);

  });


  document.getElementById("matches").innerHTML =

    Object.entries(days)

      .sort(
        (a, b) =>
          Number(a[0]) - Number(b[0])
      )

      .map(
        ([day, matchesOfDay]) => `

          <div class="matchday">

            <h3>
              Día ${day}
              ${
                MATCH_DATES[day]
                  ? ` · ${MATCH_DATES[day]}`
                  : ""
              }
            </h3>

            ${matchesOfDay
              .map(match => `

                <div class="match">

                  <span>
                    ${
                      match.gender === "M"
                        ? "Hombres"
                        : "Mujeres"
                    }
                  </span>

                  <strong>
                    ${match.home_team}
                    vs
                    ${match.away_team}
                  </strong>

                  <span class="score">

                    ${
                      match.home_score == null ||
                      match.away_score == null

                        ? "—"

                        : `
                          ${match.home_score}
                          -
                          ${match.away_score}
                        `
                    }

                  </span>


                  ${
                    session

                      ? `
                        <button
                          class="outline edit"
                          onclick="editMatch(
                            '${match.id}',
                            '${match.home_team}',
                            '${match.away_team}',
                            ${
                              match.home_score ??
                              "null"
                            },
                            ${
                              match.away_score ??
                              "null"
                            }
                          )"
                        >
                          Editar
                        </button>
                      `

                      : ""
                  }

                </div>

              `)
              .join("")
            }

          </div>

        `
      )
      .join("")

    ||

    '<div class="empty">No hay partidos cargados.</div>';

}


// ============================================
// PRÓXIMO PARTIDO
// ============================================

async function renderNext() {

  const matches =
    await getMatches();


  const next =
    matches.find(
      match =>
        match.home_score == null ||
        match.away_score == null
    );


  document.getElementById("nextMatch").innerHTML =

    next

      ? `
          <small>
            PRÓXIMO PARTIDO · DÍA ${next.day}
            ${
              MATCH_DATES[next.day]
                ? ` · ${MATCH_DATES[next.day]}`
                : ""
            }
          </small>

          <h2>
            ${next.home_team}
            vs
            ${next.away_team}
          </h2>

          <p>
            ${
              next.gender === "M"
                ? "Hombres"
                : "Mujeres"
            }
          </p>
        `

      : `
          <h2>
            Todos los partidos tienen resultado.
          </h2>
        `;

}


// ============================================
// EDITAR PARTIDO
// ============================================

function editMatch(
  id,
  home,
  away,
  homeScore,
  awayScore
) {

  if (!session) {

    openModal();

    return;

  }


  document.getElementById("editTitle").textContent =
    `${home} vs ${away}`;


  document.getElementById("editBody").innerHTML = `

    <input
      id="hs"
      type="number"
      min="0"
      value="${
        homeScore === null
          ? ""
          : homeScore
      }"
      placeholder="Goles ${home}"
    >

    <input
      id="as"
      type="number"
      min="0"
      value="${
        awayScore === null
          ? ""
          : awayScore
      }"
      placeholder="Goles ${away}"
    >

    <button
      class="primary"
      onclick="saveMatch('${id}')"
    >
      Guardar resultado
    </button>

  `;


  document
    .getElementById("editModal")
    .classList.remove("hidden");

}


// ============================================
// GUARDAR RESULTADO
// ============================================

async function saveMatch(id) {

  if (!session) {

    openModal();

    return;

  }


  const homeScore =
    document.getElementById("hs").value;

  const awayScore =
    document.getElementById("as").value;


  if (
    homeScore === "" ||
    awayScore === ""
  ) {

    alert("Escribe ambos resultados.");

    return;

  }


  const { error } =
    await db
      .from("matches")
      .update({
        home_score:
          Number(homeScore),

        away_score:
          Number(awayScore)
      })
      .eq("id", id);


  if (error) {

    alert(error.message);

  } else {

    closeEdit();

    await refresh();

  }

}


// ============================================
// GOLEADORES
// ============================================

async function renderScorers() {

  const { data, error } =
    await db
      .from("scorers")
      .select("*")
      .order("goals", {
        ascending: false
      });


  if (error) {

    document.getElementById("menScorers").innerHTML =
      `
        <tr>
          <td colspan="5">
            No se pudieron cargar los goleadores.
          </td>
        </tr>
      `;


    document.getElementById("womenScorers").innerHTML =
      `
        <tr>
          <td colspan="5">
            No se pudieron cargar las goleadoras.
          </td>
        </tr>
      `;

    return;

  }


  const men =
    (data || [])
      .filter(
        scorer =>
          scorer.gender === "M"
      );


  const women =
    (data || [])
      .filter(
        scorer =>
          scorer.gender === "F"
      );


  renderScorerTable(
    "menScorers",
    men,
    "No hay goleadores registrados."
  );


  renderScorerTable(
    "womenScorers",
    women,
    "No hay goleadoras registradas."
  );

}


// ============================================
// TABLA DE GOLEADORES
// ============================================

function renderScorerTable(
  elementId,
  scorers,
  emptyMessage
) {

  document.getElementById(elementId).innerHTML =

    scorers.length

      ? scorers
          .map(
            (scorer, index) => `

              <tr>

                <td class="rank">
                  ${index + 1}
                </td>

                <td>
                  <strong>
                    ${scorer.player}
                  </strong>
                </td>

                <td>
                  ${officialTeamName(scorer.team)}
                </td>

                <td class="pts">
                  ${scorer.goals}
                </td>

                <td>

                  ${
                    session

                      ? `
                        <button
                          class="outline"
                          onclick="editScorer('${scorer.id}')"
                        >
                          Editar
                        </button>

                        <button
                          class="danger"
                          onclick="deleteScorer('${scorer.id}')"
                        >
                          Eliminar
                        </button>
                      `

                      : ""
                  }

                </td>

              </tr>

            `
          )
          .join("")

      : `
          <tr>
            <td colspan="5">
              ${emptyMessage}
            </td>
          </tr>
        `;

}


// ============================================
// AGREGAR GOLEADOR
// ============================================

function openScorerForm() {

  if (!session) {

    openModal();

    document.getElementById("authMsg").textContent =
      "Inicia sesión como organizador para agregar goleadores.";

    return;

  }


  document.getElementById("editTitle").textContent =
    "Agregar goleador";


  document.getElementById("editBody").innerHTML = `

    <input
      id="scorerPlayer"
      placeholder="Nombre del jugador"
    >

    <select id="scorerGender">

      <option value="M">
        Hombre
      </option>

      <option value="F">
        Mujer
      </option>

    </select>


    <select id="scorerTeam"></select>


    <input
      id="scorerGoals"
      type="number"
      min="0"
      value="0"
      placeholder="Goles"
    >


    <button
      class="primary"
      onclick="saveScorer()"
    >
      Guardar goleador
    </button>

  `;


  updateScorerTeams();


  document
    .getElementById("scorerGender")
    .addEventListener(
      "change",
      updateScorerTeams
    );


  document
    .getElementById("editModal")
    .classList.remove("hidden");

}


// ============================================
// EQUIPOS EN GOLEADORES
// ============================================

function updateScorerTeams() {

  const gender =
    document.getElementById("scorerGender").value;


  const teams =
    gender === "M"
      ? [...MEN_A, ...MEN_B]
      : WOMEN;


  document.getElementById("scorerTeam").innerHTML =

    teams
      .map(
        team =>
          `
            <option value="${team}">
              ${team}
            </option>
          `
      )
      .join("");

}


// ============================================
// GUARDAR GOLEADOR
// ============================================

async function saveScorer() {

  if (!session) {

    openModal();

    return;

  }


  const player =
    document
      .getElementById("scorerPlayer")
      .value
      .trim();


  const team =
    document
      .getElementById("scorerTeam")
      .value;


  const gender =
    document
      .getElementById("scorerGender")
      .value;


  const goals =
    Number(
      document
        .getElementById("scorerGoals")
        .value
    );


  if (!player) {

    alert(
      "Escribe el nombre del jugador."
    );

    return;

  }


  const { error } =
    await db
      .from("scorers")
      .insert({
        player,
        team,
        gender,
        goals
      });


  if (error) {

    alert(error.message);

  } else {

    closeEdit();

    await renderScorers();

  }

}


// ============================================
// EDITAR GOLEADOR
// ============================================

async function editScorer(id) {

  if (!session) {

    openModal();

    return;

  }


  const { data, error } =
    await db
      .from("scorers")
      .select("*")
      .eq("id", id)
      .single();


  if (error) {

    alert(error.message);

    return;

  }


  document.getElementById("editTitle").textContent =
    "Editar goleador";


  document.getElementById("editBody").innerHTML = `

    <input
      id="scorerPlayer"
      value="${data.player}"
      placeholder="Nombre del jugador"
    >


    <select id="scorerGender">

      <option
        value="M"
        ${
          data.gender === "M"
            ? "selected"
            : ""
        }
      >
        Hombre
      </option>

      <option
        value="F"
        ${
          data.gender === "F"
            ? "selected"
            : ""
        }
      >
        Mujer
      </option>

    </select>


    <select id="scorerTeam"></select>


    <input
      id="scorerGoals"
      type="number"
      min="0"
      value="${data.goals}"
    >


    <button
      class="primary"
      onclick="updateScorer('${id}')"
    >
      Guardar cambios
    </button>

  `;


  updateScorerTeams();


  document.getElementById("scorerTeam").value =
    officialTeamName(data.team);


  document
    .getElementById("scorerGender")
    .addEventListener(
      "change",
      updateScorerTeams
    );


  document
    .getElementById("editModal")
    .classList.remove("hidden");

}


// ============================================
// ACTUALIZAR GOLEADOR
// ============================================

async function updateScorer(id) {

  if (!session) {

    openModal();

    return;

  }


  const player =
    document
      .getElementById("scorerPlayer")
      .value
      .trim();


  const team =
    document
      .getElementById("scorerTeam")
      .value;


  const gender =
    document
      .getElementById("scorerGender")
      .value;


  const goals =
    Number(
      document
        .getElementById("scorerGoals")
        .value
    );


  const { error } =
    await db
      .from("scorers")
      .update({
        player,
        team,
        gender,
        goals
      })
      .eq("id", id);


  if (error) {

    alert(error.message);

  } else {

    closeEdit();

    await renderScorers();

  }

}


// ============================================
// ELIMINAR GOLEADOR
// ============================================

async function deleteScorer(id) {

  if (!session) {

    openModal();

    return;

  }


  if (
    !confirm(
      "¿Eliminar este goleador?"
    )
  ) {

    return;

  }


  const { error } =
    await db
      .from("scorers")
      .delete()
      .eq("id", id);


  if (error) {

    alert(error.message);

  } else {

    await renderScorers();

  }

}


// ============================================
// SANCIONES
// ============================================

async function renderSanctions() {

  if (!db) {

    document.getElementById("sanctions").innerHTML =
      '<div class="empty">Conecta Supabase para activar sanciones.</div>';

    return;

  }


  const { data, error } =
    await db
      .from("sanctions")
      .select("*")
      .order("created_at", {
        ascending: false
      });


  if (error) {

    document.getElementById("sanctions").innerHTML =
      '<div class="empty">Configura la base de datos para ver sanciones.</div>';

    return;

  }


  document.getElementById("sanctions").innerHTML =

    data.length

      ? data
          .map(
            sanction => `

              <div class="sanction">

                <strong>
                  ${officialTeamName(sanction.team)}
                </strong>

                <span>
                  ${sanction.player || "—"}
                </span>

                <span>
                  ${sanction.type}
                </span>

                <span>
                  ${sanction.description || ""}
                </span>

                ${
                  session

                    ? `
                      <button
                        class="danger"
                        onclick="deleteSanction('${sanction.id}')"
                      >
                        Eliminar
                      </button>
                    `

                    : ""
                }

              </div>

            `
          )
          .join("")

      : '<div class="empty">No hay sanciones registradas.</div>';

}


// ============================================
// AGREGAR SANCIÓN
// ============================================

function openSanctionForm() {

  if (!session) {

    openModal();

    return;

  }


  document.getElementById("editTitle").textContent =
    "Agregar sanción";


  document.getElementById("editBody").innerHTML = `

    <select id="st">

      ${ALL_TEAMS
        .map(
          team =>
            `
              <option value="${team}">
                ${team}
              </option>
            `
        )
        .join("")}

    </select>


    <input
      id="sp"
      placeholder="Jugador (opcional)"
    >


    <select id="sy">

      <option>
        Tarjeta amarilla
      </option>

      <option>
        Tarjeta roja
      </option>

      <option>
        Suspensión
      </option>

      <option>
        Otra
      </option>

    </select>


    <textarea
      id="sd"
      placeholder="Descripción"
    ></textarea>


    <button
      class="primary"
      onclick="saveSanction()"
    >
      Guardar sanción
    </button>

  `;


  document
    .getElementById("editModal")
    .classList.remove("hidden");

}


// ============================================
// GUARDAR SANCIÓN
// ============================================

async function saveSanction() {

  if (!session) {

    openModal();

    return;

  }


  const payload = {

    team:
      document.getElementById("st").value,

    player:
      document.getElementById("sp").value,

    type:
      document.getElementById("sy").value,

    description:
      document.getElementById("sd").value

  };


  const { error } =
    await db
      .from("sanctions")
      .insert(payload);


  if (error) {

    alert(error.message);

  } else {

    closeEdit();

    await renderSanctions();

  }

}


// ============================================
// ELIMINAR SANCIÓN
// ============================================

async function deleteSanction(id) {

  if (!session) {

    openModal();

    return;

  }


  if (
    confirm(
      "¿Eliminar esta sanción?"
    )
  ) {

    const { error } =
      await db
        .from("sanctions")
        .delete()
        .eq("id", id);


    if (error) {

      alert(error.message);

      return;

    }


    await renderSanctions();

  }

}


// ============================================
// MODO DEMO
// ============================================

function renderDemo() {

  document.getElementById("menTables").innerHTML =

    tableHTML(
      "Grupo A",
      stats(
        MEN_A,
        [
          {
            home_team: "Fortnite",
            away_team: "Chifladitos",
            home_score: 1,
            away_score: 0
          }
        ]
      )
    )


    +

    tableHTML(
      "Grupo B",
      stats(
        MEN_B,
        [
          {
            home_team: "Sin Espinas",
            away_team: "Motoneta",
            home_score: 2,
            away_score: 1
          }
        ]
      )
    );


  document.getElementById("womenTable").innerHTML =

    tableHTML(
      "Grupo único · Los 4 mejores avanzan",
      stats(WOMEN, [])
    );


  document.getElementById("matches").innerHTML =
    '<div class="empty">Modo demo. Configura Supabase para edición compartida.</div>';


  document.getElementById("sanctions").innerHTML =
    '<div class="empty">Las sanciones aparecerán aquí al conectar Supabase.</div>';


  document.getElementById("menScorers").innerHTML =
    '<tr><td colspan="5">Modo demo.</td></tr>';


  document.getElementById("womenScorers").innerHTML =
    '<tr><td colspan="5">Modo demo.</td></tr>';


  document.getElementById("nextMatch").innerHTML =
    "<small>DEMO</small><h2>Configura la base de datos</h2>";

}
