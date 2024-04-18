document.addEventListener('DOMContentLoaded', function() {
  const doctorSelect = document.getElementById('doctor-select');
  const appointmentDate = document.getElementById('appointment-date');
  const appointmentTime = document.getElementById('appointment-time');
  const scheduleButton = document.getElementById('schedule-appointment');
  const clearButton = document.getElementById('clear-fields');
  const clearAllAppointmentsButton = document.getElementById('clear-all-appointments'); // Nuevo botón
  const appointmentList = document.getElementById('appointment-list');

  scheduleButton.addEventListener('click', function() {
    const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
    const selectedDate = appointmentDate.value;
    const selectedTime = appointmentTime.value;

    if (selectedDate && selectedTime) {
      const newAppointment = document.createElement('li');
      newAppointment.textContent = `Cita programada con ${doctorName} el ${selectedDate} a las ${selectedTime}.`;
      appointmentList.appendChild(newAppointment);
    } else {
      alert('Por favor, selecciona una fecha y hora para programar la cita.');
    }
  });

  clearButton.addEventListener('click', function() {
    appointmentDate.value = '';
    appointmentTime.value = '';
  });

  // Función para limpiar todas las citas
  clearAllAppointmentsButton.addEventListener('click', function() {
    appointmentList.innerHTML = '';
  });
});

  