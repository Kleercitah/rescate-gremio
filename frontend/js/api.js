// ============================================================
//  Capa que habla con el backend.
//  Ninguna funcion de este archivo toca el HTML.
// ============================================================

// Envoltura de fetch: agrega el token a cada peticion protegida
async function apiFetch(ruta, opciones) {
    if (!opciones) opciones = {};

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };

    if (token) {
        headers.Authorization = token;
    }

    const respuesta = await fetch(API_URL + ruta, {
        method: opciones.method || "GET",
        headers: headers,
        body: opciones.body
    });

    // ────────────────────────────────────────────────────────
    //  TICKET B - Sesion vencida
    //
    //  Si el servidor responde 401 Y en localStorage habia un
    //  token guardado, significa que la sesion caduco o el
    //  token ya no sirve. En ese caso hay que:
    //
    //   1. borrar el token de localStorage
    //   2. llamar a mostrarLogin()  (ya existe en app.js)
    //   3. cortar aqui con:  throw new Error("Sesion vencida")
    //
    //  Ojo: si NO habia token, un 401 es simplemente un login
    //  fallido y debe seguir de largo para mostrar el mensaje
    //  "Email o contrasena incorrectos".
    //
    //  Escribe ese if aqui abajo.
    // ────────────────────────────────────────────────────────


    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || "Algo salio mal");
    }

    return datos;
}

function apiLogin(email, password) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password })
    });
}

function apiListarEncargos() {
    return apiFetch("/encargos");
}

function apiCrearEncargo(titulo, recompensa) {
    return apiFetch("/encargos", {
        method: "POST",
        body: JSON.stringify({ titulo: titulo, recompensa: Number(recompensa) })
    });
}

function apiCompletarEncargo(id) {
    return apiFetch("/encargos/" + id + "/completar", { method: "PATCH" });
}

function apiEliminarEncargo(id) {
    return apiFetch("/encargos/" + id, { method: "DELETE" });
}
