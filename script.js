console.log("Script Connected!");

// Variables Declaration Block

let cover_page_section = document.getElementById('section1');
let test_page_section = document.getElementById('section2');

let quote_section = document.getElementById('quote');
let user_input_section = document.getElementById('quote-input');
let mistakes_display = document.getElementById('mistakes');
let mistakes = 0;
let time = 60;
let timer = 0;
let random_paragraph = "";
let page_timer = document.getElementById('timer');

// Results Variables Declaration
accuracy_result = document.getElementById('accuracy');
wpm_result = document.getElementById('wpm');
errors_result = document.getElementById('error');
cpm_result = document.getElementById('cpm');

// Result section Variable Declaration
const result_section = document.querySelector(".result");

// Button Variables Declaration
const begin_btn = document.getElementById('begin-btn');
const start_button = document.getElementById('start-test');
const stop_button = document.getElementById('stop-test');

// Variables Declaration Block Closed

// Fuctions Block

// Display typing test section
const displayTypingTestSection = () => {
    cover_page_section.style.display = "none";
    test_page_section.style.display = "block";
}

// Random Paragraphs ApI Call(from local json file) function
const renderParagraph = () => {
    // Fetch Contents from JSON file
    fetch('./text.json')
        .then(response => response.json())
        .then(data => {
            // Random Count Declaration In Array
            const random_count = Math.floor(Math.random() * data.length);

            // Store Random Paragraph
            random_paragraph = data[random_count];

                // Array Declaration of characters in paragraphs
            let ran_pa_arr = random_paragraph.split("").map(value => {
                // Wrap the characters in a span tag
                return "<span class='quote-chars'>"+ value +"</span>";
            });

            // Join Array for display
            quote_section.innerHTML += ran_pa_arr.join("");

        })
        .catch(err => console.log(err));
}

// Start typing test function
const startTest = () => {
    mistakes = 0;
    timer = "";
    timetracker();
    user_input_section.disabled = false;
    document.getElementById('start-test').style.display = "none";
    document.getElementById('stop-test').style.display = "block";
}

// Comparing input word with random paragraph provided
user_input_section.addEventListener('input', () => {
    let paragraph_chars = document.querySelectorAll('.quote-chars');

    // Create an array from received span tags
    paragraph_chars_array = Array.from(paragraph_chars);

    // Array of users inputs characters
    let user_input_characters = user_input_section.value.split("");

    // Loop through every characters in paragraph provided
    paragraph_chars_array.forEach((char, index) => {
        // console.log(char, index);

        // Validate if provided paragraph char (char.innerText) = User input characters (user_input_characters.index)
        if (char.innerText == user_input_characters[index]) {
            char.classList.add("success");
        }

        // Check if user haven't type anything or backspace
        else if (user_input_characters[index] == null) {

                // Remove correct class(color) if exist
                if (char.classList.contains("success")) {
                    char.classList.remove("success");
                }
                else {
                    char.classList.remove("failed");
                }
            }

        // if user type wrong character
        else {
            // Verify if we have added failed class
            if (!char.classList.contains("failed")) {
                // Increment mistakes of user
                mistakes += 1;
                char.classList.add("failed");
            }
            mistakes_display.innerText = mistakes;
        }
        // Storing all characters that are type correctly/have the class .success from the paragraph
        // The variable hosting those characters(correct) will be check if it is "true"
        let correct_chars = paragraph_chars_array.every(element => {
            return element.classList.contains("success");
        });
        // End Test if all characters are correct
        if (correct_chars) {
            // console.log("okay all characters are correct!");
            displayResult()
        }
    });

})

// End Test Function
const displayResult = () => {

    clearInterval(timer);

    // Display result box
    result_section.style.display = "block";
    user_input_section.disabled = true;
    stop_button.style.display = "none";

    // Calculation for wpm, Accuracy, Errors, cpm
    let time_taken = 1;
    if (time != 0) {
        time_taken = (60 - time) / 100;
    }
    // Words per minute result
    wpm_result.innerText = (user_input_section.value.length / 5 / time_taken).toFixed(0) + " wpm";

    // Accuracy result
    accuracy_result.innerText = Math.round((user_input_section.value.length - mistakes) / user_input_section.value.length * 100) + " %";

    // Characters per minute result
    cpm_result.innerText = (user_input_section.value.length / time_taken).toFixed(0) + " cpm";

    // Errors result
    errors_result.classList.add("failed");
    errors_result.innerText = mistakes;
};

// Update timer function

const updateTimer= () => {
    if (time == 0) {
        // End Test if time = 0
        displayResult()
    }
    else {
        page_timer.innerText = --time + "s";
    }
}

// Timer tracker function
const timetracker = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

// Fuctions Block Closed

// APplication Block

window.onload = () => {
    user_input_section.value = "";
    user_input_section.disabled = true;
    document.getElementById('start-test').style.display = "block";
    document.getElementById('stop-test').style.display = "none";

    // Display random text/paragraph
    renderParagraph();
}

begin_btn.addEventListener('click', displayTypingTestSection)

start_button.addEventListener('click', startTest)

stop_button.addEventListener('click', displayResult);

// APplication Block Closed