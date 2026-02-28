// ==========================================
// CARTUCHO DE DATOS: TECNICATURA EN INFORMÁTICA
// ==========================================

const dbMaterias = {
    1: "Relación Estado-Sociedad",
    2: "Ofimática",
    3: "Matemática",
    4: "Informática",
    5: "Inglés Técnico I",
    6: "Programación",
    7: "Arquitectura de Computadoras",
    8: "Estadística y Probabilidad",
    9: "Práctica Profesionalizante I",
    10: "Sistemas Administrativos",
    11: "Redes I",
    12: "Sistemas Operativos",
    13: "Soporte Técnico I",
    14: "Práctica Profesionalizante II",
    15: "Seguridad Informática I",
    16: "Planificación Informática",
    17: "Cultura y Comunicación Contemporánea",
    18: "Identidad y Desigualdad Sociocultural",
    19: "Procesos Políticos, Económicos y el Trabajo",
    20: "Redes II",
    21: "Soporte Técnico II",
    22: "Práctica Profesionalizante III",
    23: "Seguridad Informática II",
    24: "Base de Datos",
    25: "Marco Ético y Normativo de la Profesión"
};

// Detector de años específico para Informática
function obtenerAnio(id) {
    const num = parseInt(id);
    if (num >= 1 && num <= 9) return "1° Año";
    if (num >= 10 && num <= 17) return "2° Año";
    if (num >= 18 && num <= 25) return "3° Año";
    // Si Informática tuviera 4to año, lo agregaríamos aquí.
    return "Otros";
}