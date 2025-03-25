const rightBtn = document.querySelector("#scrolling-button-right");
const leftBtn = document.querySelector("#scrolling-button-left");
const content = document.querySelector(".caja-cursado");

if (rightBtn && leftBtn && content) {
    const scrollAmount = document.querySelector(".caja-materias").clientWidth;

    // Desplazar hacia la derecha
    rightBtn.addEventListener("click", () => {
        content.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Desplazar hacia la izquierda
    leftBtn.addEventListener("click", () => {
        content.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Actualizar el estado de los botones
    function updateButtons() {
        leftBtn.disabled = content.scrollLeft === 0;
        rightBtn.disabled = content.scrollLeft + content.clientWidth >= content.scrollWidth;
    }

    // Actualizar botones al cargar la página y al desplazarse
    content.addEventListener("scroll", updateButtons);
    updateButtons(); // Llamar al cargar la página
} else {
    console.error("No se encontraron los elementos necesarios para el desplazamiento horizontal.");
    // Opcional: Mostrar un mensaje al usuario
    alert("Error: No se pudo inicializar el desplazamiento horizontal.");
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.checkbox-materia').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                let group = this.getAttribute('data-group');
                document.querySelectorAll(`.checkbox-materia[data-group="${group}"]`).forEach(other => {
                    if (other !== this) {
                        other.checked = false;
                    }
                });
            }
        });
    });
});

//Desactivar chechbox al apretar 1

document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los contenedores de materias y cajas cambiador
    const contenedores = document.querySelectorAll('.materia-contenedor, .caja-cambiador');

    // Recorrer cada contenedor
    contenedores.forEach(contenedor => {
        // Seleccionar los checkboxes dentro del contenedor actual
        const checkboxes = contenedor.querySelectorAll('.checkbox-materia');

        // Añadir un event listener a cada checkbox
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    // Desmarcar los otros checkboxes en el mismo contenedor
                    checkboxes.forEach(otherCheckbox => {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    });
                }
            });
        });
    });
});