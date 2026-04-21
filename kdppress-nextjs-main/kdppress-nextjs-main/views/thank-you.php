<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - We'll Be In Touch Soon</title>

    <?php
    include_once('includes/head.php')
        ?>

    <style>
        .thank-you-background-gradient {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #0a0a0a;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }

        .thank-you-gradient-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at 20% 50%, #ff990058 0%, transparent 50%),
                radial-gradient(circle at 80% 50%, #ff990036 0%, transparent 50%);
            z-index: 1;
            pointer-events: none;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }

        html {
            overflow: hidden;
        }

        .thank-you-container {
            position: relative;
            z-index: 1;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            box-sizing: border-box;
            overflow: hidden;
        }

        .thank-you-checkmark-wrapper {
            margin-bottom: 2rem;
            animation: scaleIn 0.5s ease-out;
        }

        .thank-you-checkmark {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF9900 0%, #ff9900b8 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 20px 60px 0 10px 30px #ff990036;
        }

        .thank-you-checkmark::before {
            content: '';
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 2px solid #ff990036;
            animation: pulse 2s ease-out infinite;
        }

        .thank-you-checkmark svg {
            width: 50px;
            height: 50px;
            stroke: white;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
        }

        .thank-you-checkmark svg polyline {
            stroke: white;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
        }

        .thank-you-content {
            max-width: 600px;
            animation: fadeInUp 0.6s ease-out 0.2s backwards;
        }

        h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #ff9900 0%, #ff990095 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .thank-you-subtitle {
            font-size: 1.25rem;
            color: #9ca3af;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .thank-you-info-cards {
            display: flex;
            justify-content: center;
            align-items: stretch;
            gap: 1.5rem;
            margin: 3rem 0;
            animation: fadeInUp 0.6s ease-out 0.4s backwards;
            flex-wrap: wrap;
        }

        .thank-you-info-card {
            background: 0 10px 30px #ff990036;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease, border-color 0.3s ease;
            flex: 0 1 250px;
        }

        .thank-you-info-card:hover {
            transform: translateY(-5px);
            border-color: #ff990058;
        }

        .thank-you-info-card-center {
            background: linear-gradient(135deg, #ff99002c 0%, #ff990036 100%);
            border: 2px solid #ff990085;
        }

        .thank-you-info-card-center:hover {
            transform: translateY(-8px);
            border-color: #ff990069;
            box-shadow: 0 20px 40px #ff990036;
        }

        .thank-you-schedule-btn {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #FF9900 0%, #ff9900b8 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .thank-you-schedule-btn {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #FF9900 0%, #ff9900b8 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .thank-you-schedule-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px 0 10px 30px #ff990036;
        }

        .thank-you-info-card-icon {
            width: 50px;
            height: 50px;
            margin: 0 auto 1rem;
            background: linear-gradient(135deg, #FF9900 0%, #ff9900b8 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .thank-you-info-card h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            color: #ffffff;
        }

        .thank-you-info-card p {
            font-size: 0.9rem;
            color: #9ca3af;
            line-height: 1.5;
        }

        .thank-you-cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 3rem;
            animation: fadeInUp 0.6s ease-out 0.6s backwards;
        }

        .thank-you-btn {
            padding: 1rem 2rem;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 200px;
            justify-content: center;
        }

        .thank-you-btn-primary {
            background: linear-gradient(135deg, #FF9900 0%, #ff9900b8 100%);
            color: white;
            box-shadow: 0 10px 30px #ff990036;
        }

        .thank-you-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px 0 10px 30px #ff990036;
        }

        .thank-you-btn-secondary {
            background: 0 10px 30px #ff990036;
            color: white;
            border: 1px solid 0 10px 30px #ff990036;
        }

        .thank-you-btn-secondary:hover {
            background: 0 10px 30px #ff990036;
            border-color: 0 10px 30px #ff990055;
        }

        .thank-you-social-links {
            margin-top: 3rem;
            animation: fadeInUp 0.6s ease-out 0.8s backwards;
        }

        .thank-you-social-links p {
            color: #9ca3af;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }

        .thank-you-social-links .social-icons {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .thank-you-social-links .social-icon {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: 0 10px 30px #ff990036;
            border: 1px solid 0 10px 30px #ff990072;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            text-decoration: none;
            color: white;
        }

        .thank-you-social-icon:hover {
            background: 0 10px 30px #ff990036;
            border-color: 0 10px 30px #ff990064;
            transform: translateY(-3px);
        }

        @keyframes scaleIn {
            from {
                transform: scale(0);
                opacity: 0;
            }

            to {
                transform: scale(1);
                opacity: 1;
            }
        }

        @keyframes fadeInUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }

            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes pulse {

            0%,
            100% {
                transform: scale(1);
                opacity: 1;
            }

            50% {
                transform: scale(1.1);
                opacity: 0;
            }
        }

        @keyframes drawCheck {
            to {
                stroke-dashoffset: 0;
            }
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }

            .thank-you-subtitle {
                font-size: 1rem;
            }

            .thank-you-info-cards {
                flex-direction: column;
                align-items: center;
            }

            .thank-you-info-card {
                padding: 1.5rem;
                width: 100%;
                max-width: 350px;
            }

            .thank-you-cta-buttons {
                flex-direction: column;
                width: 100%;
                gap: 1rem;
            }

            .thank-you-btn {
                width: 100%;
                max-width: 300px;
                padding: 1rem 1.5rem;
                font-size: 0.95rem;
                justify-content: center;
                margin-left: auto;
                margin-right: auto;
            }

            .thank-you-checkmark {
                width: 80px;
                height: 80px;
            }

            .thank-you-checkmark::before {
                width: 100px;
                height: 100px;
            }
        }

        @media (max-width: 479px) {
            .thank-you-container {
                padding: 1.5rem;
            }

            h1 {
                font-size: 1.75rem;
            }

            .thank-you-info-card {
                padding: 1.25rem;
            }

            .thank-you-cta-buttons {
                flex-direction: column !important;
                align-items: center !important;
                gap: 0.75rem !important;
                width: 100% !important;
            }

            .thank-you-btn {
                width: 100% !important;
                max-width: 280px !important;
                padding: 1rem 1.25rem !important;
                font-size: 0.85rem !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }
        }

        @media (max-width: 385px) {
            .thank-you-btn {
                max-width: 240px !important;
                padding: 0.85rem 1rem !important;
                font-size: 0.8rem !important;
            }
        }
    </style>
    <script>
        function toggleLiveChat() {
            // Wait for LiveChatWidget to be ready
            if (typeof LiveChatWidget !== 'undefined') {
                // Try to maximize the chat window
                LiveChatWidget.call('maximize');
            } else {
                console.log('LiveChat is not available');
                // Alternative: open chat in a new window if widget is not available
                window.open('https://www.livechat.com/chat-with/18940913/', '_blank', 'width=500,height=600');
            }
        }
    </script>

    <!-- Meta Pixel Code -->
    <script>
        ! function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1559809431639467');
        fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=1559809431639467&ev=PageView&noscript=1" /></noscript>
    <!-- End Meta Pixel Code -->
</head>

<body>
    <div class="thank-you-background-gradient"></div>
    <div class="thank-you-gradient-overlay"></div>

    <div class="thank-you-container">
        <div class="thank-you-checkmark-wrapper">
            <div class="thank-you-checkmark">
                <svg viewBox="0 0 52 52">
                    <polyline points="14 27 22 35 38 19" />
                </svg>
            </div>
        </div>

        <div class="thank-you-content">
            <h1>Thank You!</h1>
            <p class="thank-you-subtitle">
                We've received your message and our team will get back to you within 24 hours.
                We're excited to discuss how we can help bring your project to life.
            </p>

            <div class="thank-you-cta-buttons">
                <!-- <a href="/book-publishing/" class="thank-you-btn thank-you-btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Back to Home
                </a> -->
                <?php
                $previousPage = $_SERVER['HTTP_REFERER'] ?? 'index.php';
                ?>
                <a href="<?php echo htmlspecialchars($previousPage); ?>" class="thank-you-btn thank-you-btn-primary">
                    Back To Home
                </a>
                <a href="javascript:void(0)" class="thank-you-btn thank-you-btn-secondary" onclick="toggleLiveChat()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Live Chat
                </a>
            </div>

        </div>
    </div>
    <!-- Start of LiveChat (www.livechat.com) code -->
    <script>
        window.__lc = window.__lc || {};
        window.__lc.license = 18940913;
        (function (n, t, c) { function i(n) { return e._h ? e._h.apply(null, n) : e._q.push(n) } var e = { _q: [], _h: null, _v: "2.0", on: function () { i(["on", c.call(arguments)]) }, once: function () { i(["once", c.call(arguments)]) }, off: function () { i(["off", c.call(arguments)]) }, get: function () { if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load."); return i(["get", c.call(arguments)]) }, call: function () { i(["call", c.call(arguments)]) }, init: function () { var n = t.createElement("script"); n.async = !0, n.type = "text/javascript", n.src = "https://cdn.livechatinc.com/tracking.js", t.head.appendChild(n) } }; !n.__lc.asyncInit && e.init(), n.LiveChatWidget = n.LiveChatWidget || e }(window, document, [].slice))
    </script>
    <noscript><a href="https://www.livechat.com/chat-with/18940913/" rel="nofollow">Chat with us</a>, powered by <a
            href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">LiveChat</a></noscript>
    <!-- End of LiveChat code -->
</body>

</html>