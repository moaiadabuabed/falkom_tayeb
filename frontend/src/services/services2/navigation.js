function clearWizardData() {
  ["eventDetails", "eventType", "package", "requirements"].forEach(key => localStorage.removeItem(key));
}

function startBooking(navigate) {
  const target = "/event-details";
  clearWizardData();
  if (getToken()) navigate(target);
  else {
    localStorage.setItem("afterLogin", target);
    navigate("/login", { state: { from: target } });
  }
}