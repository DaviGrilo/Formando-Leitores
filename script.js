let count = 1;

document.getElementById("radio1").checked = true;

setInterval( function(){
    nextImage();
}, 5000)

function nextImage(){
    count++;
    if(count>4){
        count = 1;
    }

    document.getElementById("radio"+count).checked = true;
    
}

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  item.addEventListener("click", () => {
    const answer = item.querySelector(".faq-answer");
    const isVisible = answer.style.display === "block";
    answer.style.display = isVisible ? "none" : "block";
  });
});


