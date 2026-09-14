document.addEventListener("DOMContentLoaded", function () {

    const marquees = document.querySelectorAll(
        ".cst-image-marquee"
    );


    marquees.forEach(function (marquee) {

        const track = marquee.querySelector(
            ".cst-image-marquee-track"
        );

        const originalGroup = marquee.querySelector(
            ".cst-image-marquee-group"
        );


        if (!track || !originalGroup) {
            return;
        }


        /*
         * =========================================
         * PREVENT DUPLICATE INITIALIZATION
         * =========================================
         */

        if (
            marquee.dataset.marqueeInitialized === "true"
        ) {
            return;
        }

        marquee.dataset.marqueeInitialized = "true";


        /*
         * =========================================
         * SETTINGS
         * =========================================
         */

        const speed =
            parseFloat(
                marquee.dataset.speed
            ) || 80;


        const dragMultiplier =
            parseFloat(
                marquee.dataset.drag
            ) || 1;


        const dragThreshold = 5;


        const direction =
            marquee.dataset.direction === "right"
                ? "right"
                : "left";


        const directionMultiplier =
            direction === "right"
                ? 1
                : -1;


        /*
         * =========================================
         * CREATE CLONE
         * =========================================
         */

        const clonedGroup =
            originalGroup.cloneNode(true);


        clonedGroup.setAttribute(
            "aria-hidden",
            "true"
        );


        track.appendChild(
            clonedGroup
        );


        /*
         * =========================================
         * STATE
         * =========================================
         */

        let position = 0;

        let groupWidth = 0;

        let lastTime =
            performance.now();


        let isPaused = false;

        let isDragging = false;


        let dragStartX = 0;

        let dragStartPosition = 0;


        let hasMoved = false;


        /*
         * =========================================
         * NORMALIZE LOOP POSITION
         * =========================================
         */

        function normalizePosition() {

            if (groupWidth <= 0) {
                return;
            }


            while (
                position <= -groupWidth
            ) {

                position += groupWidth;

            }


            while (
                position > 0
            ) {

                position -= groupWidth;

            }

        }


        /*
         * =========================================
         * APPLY TRANSFORM
         * =========================================
         */

        function applyPosition() {

            track.style.transform =
                `translate3d(${position}px, 0, 0)`;

        }


        /*
         * =========================================
         * CALCULATE GROUP WIDTH
         * =========================================
         */

        function calculateGroupWidth() {

            groupWidth =
                originalGroup.getBoundingClientRect().width;


            /*
             * For right-moving marquees,
             * start one group to the left
             * so there is content available
             * to move into view.
             */
            if (
                direction === "right" &&
                position === 0
            ) {

                position =
                    -groupWidth;

            }


            normalizePosition();

            applyPosition();

        }


        /*
         * =========================================
         * WAIT FOR IMAGES
         * =========================================
         */

        const images =
            originalGroup.querySelectorAll("img");


        let loadedImages = 0;


        function imageReady() {

            loadedImages++;


            if (
                loadedImages >= images.length
            ) {

                calculateGroupWidth();

            }

        }


        if (images.length) {

            images.forEach(function (image) {

                if (image.complete) {

                    imageReady();

                } else {

                    image.addEventListener(
                        "load",
                        imageReady,
                        {
                            once: true
                        }
                    );


                    image.addEventListener(
                        "error",
                        imageReady,
                        {
                            once: true
                        }
                    );

                }

            });

        } else {

            calculateGroupWidth();

        }


        /*
         * =========================================
         * RESIZE
         * =========================================
         */

        window.addEventListener(
            "resize",
            function () {

                calculateGroupWidth();

            }
        );


        /*
         * =========================================
         * HOVER PAUSE
         * =========================================
         */

        marquee.addEventListener(
            "mouseenter",
            function () {

                isPaused = true;

            }
        );


        marquee.addEventListener(
            "mouseleave",
            function () {

                if (!isDragging) {

                    isPaused = false;

                    lastTime =
                        performance.now();

                }

            }
        );


        /*
         * =========================================
         * POINTER DOWN
         * =========================================
         */

        marquee.addEventListener(
            "pointerdown",
            function (event) {

                /*
                 * Ignore right-click / middle-click.
                 */
                if (
                    event.pointerType === "mouse" &&
                    event.button !== 0
                ) {
                    return;
                }


                isDragging = true;

                isPaused = true;

                hasMoved = false;


                dragStartX =
                    event.clientX;


                dragStartPosition =
                    position;


                /*
                 * Capture pointer at marquee level.
                 * This allows dragging to continue
                 * even if pointer started on a link.
                 */
                marquee.setPointerCapture(
                    event.pointerId
                );


                marquee.classList.add(
                    "is-dragging"
                );

            }
        );


        /*
         * =========================================
         * POINTER MOVE
         * =========================================
         */

        marquee.addEventListener(
            "pointermove",
            function (event) {

                if (!isDragging) {
                    return;
                }


                const dragDistance =
                    event.clientX -
                    dragStartX;


                /*
                 * Detect actual drag.
                 */
                if (
                    Math.abs(dragDistance) >
                    dragThreshold
                ) {

                    hasMoved = true;

                }


                position =
                    dragStartPosition +
                    (
                        dragDistance *
                        dragMultiplier
                    );


                normalizePosition();

                applyPosition();

            }
        );


        /*
         * =========================================
         * POINTER UP / CANCEL
         * =========================================
         */

        function stopDragging(event) {

            if (!isDragging) {
                return;
            }


            isDragging = false;


            marquee.classList.remove(
                "is-dragging"
            );


            if (
                event &&
                marquee.hasPointerCapture &&
                marquee.hasPointerCapture(
                    event.pointerId
                )
            ) {

                marquee.releasePointerCapture(
                    event.pointerId
                );

            }


            /*
             * Resume autoplay only
             * when no longer hovering.
             */
            if (
                !marquee.matches(":hover")
            ) {

                isPaused = false;

            }


            lastTime =
                performance.now();

        }


        marquee.addEventListener(
            "pointerup",
            stopDragging
        );


        marquee.addEventListener(
            "pointercancel",
            stopDragging
        );


        /*
         * =========================================
         * LINK CLICK HANDLING
         * =========================================
         *
         * Normal click:
         * href works.
         *
         * Drag:
         * href is cancelled.
         */

        marquee.addEventListener(
            "click",
            function (event) {

                const link =
                    event.target.closest("a");


                if (
                    link &&
                    hasMoved
                ) {

                    event.preventDefault();

                    event.stopPropagation();

                }

            },
            true
        );


        /*
         * =========================================
         * PREVENT NATIVE DRAGGING
         * =========================================
         */

        marquee.addEventListener(
            "dragstart",
            function (event) {

                event.preventDefault();

            }
        );


        /*
         * =========================================
         * AUTOPLAY
         * =========================================
         */

        function animate(currentTime) {

            const deltaTime =
                (
                    currentTime -
                    lastTime
                ) / 1000;


            lastTime =
                currentTime;


            if (
                !isPaused &&
                !isDragging &&
                groupWidth > 0
            ) {

                position +=
                    speed *
                    deltaTime *
                    directionMultiplier;


                normalizePosition();

                applyPosition();

            }


            requestAnimationFrame(
                animate
            );

        }


        requestAnimationFrame(
            animate
        );

    });

});