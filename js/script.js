document.addEventListener("DOMContentLoaded", function () {

    cstATFFakeSection("cst-atf-section");
    cstFakeSectionCreation("cst-section-2");
    cstFakeSectionCreation("cst-section-3");
    setActiveATFFake("cst-atf-section-fake");

    var cstSizeLists = document.querySelectorAll('.cst-size');
    cstSizeLists.forEach(item => {
        item.setAttribute('onclick', "setItemSize(this)");
    });

    // Set active-gsap
    const waitingSections = document.querySelectorAll(".scroll-waiting");

    /*
    * Detection advance in pixels.
    *
    * 0   = normal center detection
    * 50  = activate next section 50px earlier
    * 100 = activate next section 100px earlier
    */
    const detectionAdvance = 250;


    function updateScrollSections() {

        /*
        * Normal detection point is the middle
        * of the viewport.
        *
        * Adding detectionAdvance moves the
        * detection point lower, causing the
        * next section to activate earlier
        * while scrolling down.
        */
        const detectionPoint =
            (window.innerHeight / 2) + detectionAdvance;


        let activeIndex = -1;


        /*
        * Find which section currently contains
        * the detection point.
        */
        waitingSections.forEach(function(section, index) {

            const rect = section.getBoundingClientRect();

            const isActive =
                rect.top <= detectionPoint &&
                rect.bottom >= detectionPoint;


            if (isActive) {

                activeIndex = index;

            }

        });



        /*
        * Apply section states
        */
        waitingSections.forEach(function(section, index) {

            section.classList.remove(
                "cst-active-gsap",
                "cst-passed-gsap"
            );


            /*
            * Current section
            */
            if (index === activeIndex) {

                section.classList.add(
                    "cst-active-gsap"
                );

            }


            /*
            * Sections before current section
            */
            else if (
                activeIndex !== -1 &&
                index < activeIndex
            ) {

                section.classList.add(
                    "cst-passed-gsap"
                );

            }

        });

    }



    /*
    * Run while scrolling
    */
    window.addEventListener(
        "scroll",
        updateScrollSections,
        {
            passive: true
        }
    );



    /*
    * Recalculate if viewport changes
    */
    window.addEventListener(
        "resize",
        updateScrollSections
    );



    /*
    * Initial check
    */
    updateScrollSections();
    //Set active-gsap code end here

    // Detect when user starts scrolling from the top

    function detectScrollStart() {

        if (window.scrollY > 0) {

            document.body.classList.add(
                "cst-scroll-started"
            );

        } else {

            document.body.classList.remove(
                "cst-scroll-started"
            );

        }

    }

    window.addEventListener(
        "scroll",
        detectScrollStart,
        {
            passive: true
        }
    );

    // Initial check
    detectScrollStart();
});

let atfSectionHeight = 0;
let fakeSectionCreation = 0;

function cstATFFakeSection(x){
    const cstClassLists = x;
    const atfSection = document.querySelector("."+cstClassLists);
    

    if (atfSection) {

        const height = atfSection.offsetHeight;
        atfSectionHeight = height;

        var cstatfSectionFake = document.createElement("div");
        cstatfSectionFake.classList.add(cstClassLists + "-fake");
        cstatfSectionFake.classList.add("scroll-waiting");
        cstatfSectionFake.style.height = height + "px";

        atfSection.parentNode.insertBefore(
            cstatfSectionFake,
            atfSection
        );

        atfSection.classList.add("fixed-gsap");

    }
}

function cstFakeSectionCreation(x){
    const cstClassLists = x;
    const atfSection = document.querySelector("."+cstClassLists);
    

    if (atfSection) {

        const height = atfSection.offsetHeight;
        fakeSectionCreation = height;

        var cstatfSectionFake = document.createElement("div");
        cstatfSectionFake.classList.add(cstClassLists + "-fake");
        cstatfSectionFake.classList.add("scroll-waiting");
        cstatfSectionFake.style.height = height + "px";

        atfSection.parentNode.insertBefore(
            cstatfSectionFake,
            atfSection
        );
        
        atfSection.classList.add("fixed-gsap");
        atfSection.classList.add("cst-below-atf");

    }
}

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
        if (cstScrollPercentage > 82) {

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


function setActiveATFFake(x){
    var cstSetFake = document.querySelector("."+x);    
    // cstSetFake.classList.add("cst-active-gsap");
}


