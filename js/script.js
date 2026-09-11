let atfSectionHeight = 0;

document.addEventListener("DOMContentLoaded", function () {

    const cstClassLists = "cst-atf-section";
    const atfSection = document.querySelector("."+cstClassLists);
    

    if (atfSection) {

        const height = atfSection.offsetHeight;
        atfSectionHeight = height;

        var cstatfSectionFake = document.createElement("div");
        cstatfSectionFake.classList.add(cstClassLists + "-fake");
        cstatfSectionFake.style.height = height + "px";

        atfSection.parentNode.insertBefore(
            cstatfSectionFake,
            atfSection
        );

        atfSection.classList.add("fixed-gsap");

        console.log("ATF Section Height:", height + "px");

    }

    var cstSizeLists = document.querySelectorAll('.cst-size');
    cstSizeLists.forEach(item => {
        item.setAttribute('onclick', "setItemSize(this)");
    });

});

const cstGsapScroll1 = document.querySelector(".cst-gsap-scroll-1");

const scrollTexts = [
    {
        element: document.querySelector(".cst-atf-section .cst-row-1 .cst-col-1"),
        start: 1100,
        speed: 1
    },
    {
        element: document.querySelector(".cst-atf-section .cst-row-1 .cst-col-3"),
        start: 1100,
        speed: 1
    }
];


let currentY = 0;
let targetY = 0;


// Store animation values for text elements
scrollTexts.forEach(item => {
    item.currentY = 0;
    item.targetY = 0;
});



window.addEventListener("scroll", function () {

    if (!cstGsapScroll1) return;


    let scrollPosition = window.scrollY;


    // Main element
    targetY = scrollPosition;



    // Text animations
    scrollTexts.forEach(item => {

        if (!item.element) return;

        let cstScrollPercentage = (scrollPosition/atfSectionHeight) * 100;
        // if (scrollPosition > item.start) {
        if (cstScrollPercentage > 87) {

            item.targetY = 
                (scrollPosition - item.start) * item.speed;

        } else {

            item.targetY = 0;

        }

    });


});



function animateScroll() {


    // Main background/image movement
    currentY += (targetY - currentY) * 0.09;


    if (cstGsapScroll1) {

        cstGsapScroll1.style.transform =
            `translateY(${-currentY - 100}px)`;

    }



    // Text movement
    scrollTexts.forEach(item => {


        if (!item.element) return;


        item.currentY += 
            (item.targetY - item.currentY) * 0.09;



        item.element.style.transform =
            `translateY(${-item.currentY}px)`;


    });



    requestAnimationFrame(animateScroll);

}


animateScroll();


function setItemSize(x){
    let cst_element = x;

    var cstSizeLists = document.querySelectorAll('.cst-size');
    cstSizeLists.forEach(item => {
        item.classList.remove("cst-active");
    });

    cst_element.classList.add("cst-active");
}