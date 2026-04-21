<?php $show_testimonial_platform_icons = isset($show_testimonial_platform_icons) && $show_testimonial_platform_icons; ?>
<section class="testimonials pt50 mt_testi">
    <?php if ($show_testimonial_platform_icons) { ?>
        <style>
            .testi_cards_header {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .testimonials .testimonial-platform-icons {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex-wrap: wrap;
                gap: 12px;
                position: absolute;
                right: 20px;
                top: 22px;
            }

            .testimonials .testimonial-platform-icon {
                height: 35px;
                width: auto;
                object-fit: contain;
                /* filter: grayscale(1); */
                opacity: 1;
            }

            @media (max-width: 991px) {
                .testimonials .testimonial-platform-icons {
                    justify-content: flex-start;
                    margin-top: 10px;
                }
            }

            @media (max-width: 575px) {
                .testimonials .testimonial-platform-icons {
                    justify-content: center;
                }
            }
        </style>
    <?php } ?>
    <div class="container">
        <div class="row align-items-center mb-40">
            <div class="<?php echo $show_testimonial_platform_icons ? "col-12" : "col-lg-12"; ?> text-lg-left pb40">
                <h4 class=" mb-3 mb-md-5 text-center">Testimonials</h4>
            </div>
        </div>
        <div class="owl-carousel owl-theme testimonial_slider">
            <div class="item">
                <div class="testimonial-each mb-md-30">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/trustpilot.webp" alt="Trustpilot" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class=" heading-4 fs-19 f-700 mb-10">Excellent Agency!</h3> -->
                        <p class="mb-0 test_p">
                            KDP Press made the publishing process much easier than I expected.
                            Their team guided me through editing, formatting, and publishing, and I felt
                            supported throughout the journey.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name mt-5 blue fs-17 f-700 heading-6">Emily Carter </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each mb-md-70">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/clutch.webp" alt="Clutch" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Highly Pocket-friendly</h3> -->
                        <p class="mb-0 test_p">Working with KDP Press was a great experience. They
                            were professional, responsive, and helped prepare my manuscript for publication
                            with attention to detail. </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">Daniel Foster</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/reviewsio.webp" alt="Reviews.io" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Best Company</h3> -->
                        <p class="mb-0 test_p">As a first-time author, I had many questions. The team
                            patiently explained every step and helped me move from a manuscript to a
                            published book with confidence.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">Rachel Morgan </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/trustpilot.webp" alt="Trustpilot" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Commitment Fulfillment </h3> -->
                        <p class="mb-0 test_p">I appreciated how organized and supportive the team was. They
                            helped refine my manuscript and ensured everything was ready before publishing.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">Kevin Marshall </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/clutch.webp" alt="Trustpilot" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Commitment Fulfillment </h3> -->
                        <p class="mb-0 test_p">The editors were thorough and helped improve the clarity and
                            flow of my book while keeping my original voice intact.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">Laura Bennett </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/reviewsio.webp" alt="Reviews.io" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Commitment Fulfillment </h3> -->
                        <p class="mb-0 test_p">Publishing my book felt overwhelming at first, but KD
                            Publisher Group made the process smooth and easy to understand.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">Michael Thompson </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/trustpilot.webp" alt="Trustpilot" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Commitment Fulfillment </h3> -->
                        <p class="mb-0 test_p">The cover design and formatting work were excellent. My book
                            looks professional and exactly how I imagined it.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">Olivia Sanders </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/clutch.webp" alt="Trustpilot" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Commitment Fulfillment </h3> -->
                        <p class="mb-0 test_p">The team communicated clearly and kept me updated throughout
                            the process. I felt confident knowing my book was in capable hands.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">Christopher Hayes </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/reviewsio.webp" alt="Trustpilot" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Commitment Fulfillment </h3> -->
                        <p class="mb-0 test_p">They helped turn my completed manuscript into a
                            professionally prepared book ready for publishing platforms. I’m very pleased
                            with the outcome.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">Sophia Mitchell </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="testimonial-each">
                    <div class="testimonial-quote bg-light-white">
                        <div class="testi_cards_header">
                            <i class="fa fa-quote-left quote-blue"></i>
                            <ul class="stars-rate mb-15" data-starsactive="5">
                                <li class="text-left lh-10">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </li>
                            </ul>
                            <!-- <?php if ($show_testimonial_platform_icons) { ?>
                                <div class="testimonial-platform-icons" aria-label="Review platforms">
                                    <img src="img/trustpilot.webp" alt="Trustpilot" loading="lazy"
                                        class="testimonial-platform-icon">
                                </div>
                            <?php } ?> -->
                        </div>
                        <!-- <h3 class="heading-4 fs-19 f-700 mb-10">Commitment Fulfillment </h3> -->
                        <p class="mb-0 test_p">From editing to final preparation for publishing, the entire
                            experience was professional and well organized. I would recommend their services
                            to other authors.
                        </p>
                    </div>
                    <div class="client-2-img mt-40 d-flex align-items-center justify-content-start">
                        <div class="client-text-2">
                            <h4 class="client-name blue mt-5 fs-17 f-700  heading-6">James Walker </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</section>