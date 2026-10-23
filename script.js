document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const feedbackForm = document.getElementById("feedbackForm");

  // Input elements
  const studentName = document.getElementById("studentName");
  const courseName = document.getElementById("courseName");
  const facultyName = document.getElementById("facultyName");
  const teachingRating = document.getElementById("teachingRating");
  const practicalRating = document.getElementById("practicalRating");
  const contentRating = document.getElementById("contentRating");
  const comments = document.getElementById("comments");

  // Error spans
  const nameError = document.getElementById("nameError");
  const courseError = document.getElementById("courseError");
  const facultyError = document.getElementById("facultyError");
  const teachingError = document.getElementById("teachingError");
  const practicalError = document.getElementById("practicalError");
  const contentError = document.getElementById("contentError");

  function clearErrors() {
    nameError.textContent = "";
    courseError.textContent = "";
    facultyError.textContent = "";
    teachingError.textContent = "";
    practicalError.textContent = "";
    contentError.textContent = "";
  }

  // Input Validation and Error Handling
  function validateFeedback() {
    clearErrors();
    let isValid = true;

    if (!studentName.value.trim()) {
      nameError.textContent = "Student name is required.";
      isValid = false;
    }
    if (!courseName.value.trim()) {
      courseError.textContent = "Course name is required.";
      isValid = false;
    }
    if (!facultyName.value.trim()) {
      facultyError.textContent = "Faculty name is required.";
      isValid = false;
    }

    const validateRating = (val, errEl, label) => {
      if (val === "") {
        errEl.textContent = `${label} rating is required.`;
        return false;
      }
      const num = parseFloat(val);
      if (isNaN(num) || num < 1 || num > 5) {
        errEl.textContent = `${label} must be a number between 1 and 5.`;
        return false;
      }
      return true;
    };

    if (!validateRating(teachingRating.value, teachingError, "Teaching")) isValid = false;
    if (!validateRating(practicalRating.value, practicalError, "Practical")) isValid = false;
    if (!validateRating(contentRating.value, contentError, "Content")) isValid = false;

    return isValid;
  }

  // Core Calculation Functions
  function calculateAverage(teaching, practical, content) {
    return (teaching + practical + content) / 3;
  }

  function calculatePercentage(average) {
    return (average / 5) * 100;
  }

  function getClassification(average) {
    if (average >= 4.50) return "excellent";
    if (average >= 3.50) return "very good";
    if (average >= 2.50) return "good";
    if (average >= 1.50) return "Needs improvement";
    return "poor";
  }

  function getRecommendation(classification) {
    switch (classification) {
      case "excellent": return "maintain current teaching approach";
      case "very good": return "Minor improvement may be considered";
      case "good": return "improvement required in selected areas";
      case "Needs improvement": return "review teaching/content delivery";
      case "poor": return "immediate improvement plan required";
      default: return "";
    }
  }

  // Performance Analysis with tie-checking
  function analyzePerformance(t, p, c) {
    const categories = [
      { name: "Teaching", val: t },
      { name: "Practical/Lab", val: p },
      { name: "Course Content", val: c }
    ];
    
    const minVal = Math.min(t, p, c);
    const lowestCategories = categories
      .filter(cat => cat.val === minVal)
      .map(cat => `${cat.name} (${cat.val})`);

    const isAllHigh = (t >= 4.5 && p >= 4.5 && c >= 4.5);

    return {
      lowestText: lowestCategories.join(", "),
      isAllHigh: isAllHigh
    };
  }

  // Dynamic Feedback Processing
  function submitFeedback() {
    if (!validateFeedback()) {
      alert("Validation failed! Please fix the errors highlighted in the form.");
      return;
    }

    if (!confirm("Are you sure you want to submit your feedback?")) {
      return; // Cancelled, retain current dashboard state
    }

    const suggestion = prompt("Optional: Enter any specific improvement suggestion:");

    const t = parseFloat(teachingRating.value);
    const p = parseFloat(practicalRating.value);
    const c = parseFloat(contentRating.value);

    // Calculations using unrounded average, displayed score rounded to 2 decimal places
    const unroundedAvg = calculateAverage(t, p, c);
    const percentage = calculatePercentage(unroundedAvg);
    const classification = getClassification(unroundedAvg);
    const recommendation = getRecommendation(classification);
    const analysis = analyzePerformance(t, p, c);

    // Populate DOM results
    document.getElementById("resName").textContent = studentName.value.trim();
    document.getElementById("resCourse").textContent = courseName.value.trim();
    document.getElementById("resFaculty").textContent = facultyName.value.trim();
    document.getElementById("resAverage").textContent = unroundedAvg.toFixed(2);
    document.getElementById("resPercentage").textContent = percentage.toFixed(1);
    
    const classTag = document.getElementById("resClassification");
    classTag.textContent = classification;

    document.getElementById("resLowest").textContent = analysis.lowestText;

    // High performance alert check
    const highPerfAlert = document.getElementById("highPerfAlert");
    if (analysis.isAllHigh) {
      highPerfAlert.style.display = "block";
    } else {
      highPerfAlert.style.display = "none";
    }

    // Optional suggestion display
    const suggestionDisplay = document.getElementById("suggestionDisplay");
    if (suggestion && suggestion.trim() !== "") {
      document.getElementById("resSuggestion").textContent = suggestion.trim();
      suggestionDisplay.style.display = "block";
    } else {
      suggestionDisplay.style.display = "none";
    }

    // Recommendation display
    document.getElementById("resRecommendation").textContent = recommendation;

    // Toggle visibility containers
    document.getElementById("placeholderText").style.display = "none";
    document.getElementById("resultsContent").style.display = "block";
    document.getElementById("recommendation").style.display = "block";
    
    const badge = document.getElementById("statusBadge");
    badge.textContent = "Submitted";
    badge.classList.add("submitted");

    alert("Feedback successfully submitted and evaluated!");
  }

  // State Management & Reset
  function resetFeedback() {
    if (!confirm("Are you sure you want to reset the form and clear the dashboard?")) {
      return; // Cancelled, retain form values and results
    }

    feedbackForm.reset();
    clearErrors();

    document.getElementById("placeholderText").style.display = "block";
    document.getElementById("resultsContent").style.display = "none";
    document.getElementById("recommendation").style.display = "none";
    document.getElementById("highPerfAlert").style.display = "none";
    document.getElementById("suggestionDisplay").style.display = "none";

    const badge = document.getElementById("statusBadge");
    badge.textContent = "Awaiting Submission";
    badge.classList.remove("submitted");

    alert("Form and dashboard have been reset.");
  }

  submitBtn.addEventListener("click", submitFeedback);
  resetBtn.addEventListener("click", resetFeedback);
});