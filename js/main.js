jQuery(function($) {

	// Verificar si jQuery easing está disponible, si no, usar swing
	if (!$.easing.easeInOutQuart) {
		$.easing.easeInOutQuart = function(x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		};
	}

	//Preloader mejorado
	var preloader = $('.preloader');
	$(window).on('load', function(){
		preloader.fadeOut(800);
	});

	// Lazy Loading para imágenes
	function lazyLoadImages() {
		const images = document.querySelectorAll('img[data-src]');
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.classList.add('loaded');
					imageObserver.unobserve(img);
				}
			});
		});
		images.forEach(img => imageObserver.observe(img));
	}

	// Inicializar lazy loading
	if ('IntersectionObserver' in window) {
		lazyLoadImages();
	}

	//#main-slider mejorado con soporte touch
	var slideHeight = $(window).height();
	$('#home-slider .item').css('height', slideHeight);

	$(window).resize(function(){'use strict',
		$('#home-slider .item').css('height', slideHeight);
	});
	
	// Touch/Swipe support para carrusel
	var startX = 0;
	var startY = 0;
	var isMoving = false;
	
	$('#home-slider').on('touchstart', function(e) {
		startX = e.originalEvent.touches[0].clientX;
		startY = e.originalEvent.touches[0].clientY;
		isMoving = false;
	});
	
	$('#home-slider').on('touchmove', function(e) {
		if (!startX || !startY) return;
		
		var currentX = e.originalEvent.touches[0].clientX;
		var currentY = e.originalEvent.touches[0].clientY;
		var diffX = startX - currentX;
		var diffY = startY - currentY;
		
		if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
			isMoving = true;
			e.preventDefault();
		}
	});
	
	$('#home-slider').on('touchend', function(e) {
		if (!startX || !startY || !isMoving) return;
		
		var currentX = e.originalEvent.changedTouches[0].clientX;
		var diffX = startX - currentX;
		
		if (Math.abs(diffX) > 50) {
			if (diffX > 0) {
				// Swipe left - next slide
				$('#home-slider').carousel('next');
			} else {
				// Swipe right - previous slide
				$('#home-slider').carousel('prev');
			}
		}
		
		startX = 0;
		startY = 0;
		isMoving = false;
	});

	// Carrusel automático mejorado
	$('#home-slider').carousel({
		interval: 6000,
		pause: 'hover',
		wrap: true,
		keyboard: true
	});

	// Pausar video cuando no está visible
	$('#home-slider').on('slide.bs.carousel', function (e) {
		var video = $(this).find('.active video')[0];
		if (video) {
			video.pause();
		}
	});

	$('#home-slider').on('slid.bs.carousel', function (e) {
		var video = $(this).find('.active video')[0];
		if (video) {
			video.play();
		}
	});
	
	//Scroll Menu mejorado
	$(window).on('scroll', function(){
		if( $(window).scrollTop() > slideHeight ){
			$('.main-nav').addClass('navbar-fixed-top');
		} else {
			$('.main-nav').removeClass('navbar-fixed-top');
		}
	});
	
	// SISTEMA DE NAVEGACIÓN UNIFICADO - SOLUCIÓN DEFINITIVA
	
	// Variables globales para navegación
	var isScrolling = false;
	var navOffset = 70;
	
	// Función principal de scroll suave
	function smoothScrollTo(target, callback) {
		if (isScrolling) return false;
		
		var $target = $(target);
		if (!$target.length) return false;
		
		isScrolling = true;
		$('html, body').stop().animate({
			scrollTop: $target.offset().top - navOffset
		}, 800, 'swing', function() {
			isScrolling = false;
			if (callback) callback();
		});
		
		return true;
	}
	
	// Event handler ÚNICO para toda la navegación
	$(document).off('click.navigation').on('click.navigation', 'a[href^="#"], a[data-scroll], .btn-start', function(e) {
		var href = $(this).attr('href');
		
		// Ignorar enlaces vacíos o con solo #
		if (!href || href === '#' || href === '#!') return;
		
		// Verificar que el target existe
		var $target = $(href);
		if (!$target.length) return;
		
		e.preventDefault();
		e.stopPropagation();
		
		// Ejecutar scroll suave
		if (smoothScrollTo(href)) {
			// Marcar que la navegación está funcionando
			window.navigationWorking = true;
			
			// Cerrar menú móvil si está abierto
			if ($('.navbar-toggle').is(':visible') && $('.navbar-collapse').hasClass('in')) {
				$('.navbar-collapse').collapse('hide');
			}
			
			// Actualizar URL sin scroll
			if (history.pushState) {
				history.pushState(null, null, href);
			}
		}
	});
	
	// Handler específico para controles del carrusel
	$(document).off('click.carousel').on('click.carousel', '.carousel-control-touch', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		var action = $(this).attr('data-slide');
		var target = $(this).attr('href');
		
		if (action === 'prev') {
			$(target).carousel('prev');
		} else if (action === 'next') {
			$(target).carousel('next');
		}
	});
	
	// Función para actualizar navegación activa
	function updateActiveNavigation() {
		var scrollTop = $(window).scrollTop();
		var $navLinks = $('.navbar-nav .scroll a');
		var activeFound = false;
		
		// Revisar cada sección
		$navLinks.each(function() {
			var href = $(this).attr('href');
			if (href && href.charAt(0) === '#') {
				var $section = $(href);
				if ($section.length) {
					var sectionTop = $section.offset().top - navOffset - 50;
					var sectionBottom = sectionTop + $section.outerHeight();
					
					if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
						$('.navbar-nav .scroll').removeClass('active');
						$(this).parent().addClass('active');
						activeFound = true;
						return false; // break
					}
				}
			}
		});
		
		// Si no hay sección activa y estamos en el top, activar "Inicio"
		if (!activeFound && scrollTop < 100) {
			$('.navbar-nav .scroll').removeClass('active');
			$('.navbar-nav .scroll').first().addClass('active');
		}
	}
	
	// Scroll listener con throttling
	var scrollTimer;
	$(window).on('scroll', function() {
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(updateActiveNavigation, 50);
	});
	
	// Eventos touch específicos para móvil
	function initMobileNavigation() {
		// Touch events para botones principales
		$('.btn-start, #tohash').on('touchstart', function(e) {
			e.stopPropagation();
			$(this).addClass('touching');
		}).on('touchend', function(e) {
			var $this = $(this);
			$this.removeClass('touching');
			
			// Simular click después de un pequeño delay
			setTimeout(function() {
				var href = $this.attr('href');
				if (href && href.charAt(0) === '#') {
					smoothScrollTo(href);
				}
			}, 50);
		});
		
		// Touch events para controles del carrusel
		$('.carousel-control-touch').on('touchstart', function(e) {
			e.stopPropagation();
			$(this).addClass('touching');
		}).on('touchend', function(e) {
			var $this = $(this);
			$this.removeClass('touching');
			
			setTimeout(function() {
				var action = $this.attr('data-slide');
				var target = $this.attr('href');
				
				if (action === 'prev') {
					$(target).carousel('prev');
				} else if (action === 'next') {
					$(target).carousel('next');
				}
			}, 50);
		});
	}
	
	// Inicialización cuando el DOM esté listo
	$(document).ready(function() {
		// Deshabilitar smoothscroll.js si existe
		if (typeof smoothScroll !== 'undefined' && smoothScroll.destroy) {
			smoothScroll.destroy();
		}
		
		// Configurar navegación inicial
		updateActiveNavigation();
		
		// Inicializar navegación móvil
		if ('ontouchstart' in window || navigator.maxTouchPoints) {
			initMobileNavigation();
		}
		
		// Manejar hash en URL al cargar
		if (window.location.hash) {
			setTimeout(function() {
				smoothScrollTo(window.location.hash);
			}, 300);
		}
	});
	
	//Initiat WOW JS
	new WOW().init();
	
	// Progress Bar mejorado
	$('#about-us').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		if (visible) {
			$.each($('div.progress-bar'), function(){
				var $this = $(this);
				var targetWidth = $this.attr('data-valuetransitiongoal') + '%';
				$this.animate({width: targetWidth}, 2000, 'easeOutQuart');
			});
			$(this).unbind('inview');
		}
	});

	//Countdown mejorado
	$('#features').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		if (visible) {
			$(this).find('.timer').each(function () {
				var $this = $(this);
				var target = parseInt($this.text());
				$({ Counter: 0 }).animate({ Counter: target }, {
					duration: 3000,
					easing: 'easeOutQuart',
					step: function () {
						$this.text(Math.ceil(this.Counter));
					},
					complete: function() {
						$this.text(target);
					}
				});
			});
			$(this).unbind('inview');
		}
	});

	// Portfolio Single View mejorado
	$('#portfolio').on('click','.folio-read-more',function(event){
		event.preventDefault();
		var link = $(this).data('single_url');
		var full_url = '#portfolio-single-wrap';
		var parts = full_url.split("#");
		var trgt = parts[1];
		var target_top = $("#"+trgt).offset().top;

		$('html, body').animate({scrollTop:target_top - 70}, 800);
		$('#portfolio-single').slideUp(500, function(){
			$(this).load(link, function(){
				$(this).slideDown(500);
			});
		});
	});

	// Close Portfolio Single View
	$('#portfolio-single-wrap').on('click', '.close-folio-item',function(event) {
		event.preventDefault();
		var full_url = '#portfolio';
		var parts = full_url.split("#");
		var trgt = parts[1];
		var target_offset = $("#"+trgt).offset();
		var target_top = target_offset.top;
		$('html, body').animate({scrollTop:target_top - 70}, 800);
		$("#portfolio-single").slideUp(500);
	});

	// Contact form mejorado con validación
	var form = $('#contact-form');
	form.submit(function(event){
		event.preventDefault();
		
		// Validación básica
		var name = $('#name').val().trim();
		var email = $('#email').val().trim();
		var phone = $('#phone').val().trim();
		var msg = $('#msg').val().trim();
		
		if (!name || !email || !phone || !msg) {
			$('.respuesta').html('<div class="alert alert-danger">Por favor, complete todos los campos.</div>').fadeIn();
			return false;
		}
		
		// Validar email
		var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			$('.respuesta').html('<div class="alert alert-danger">Por favor, ingrese un email válido.</div>').fadeIn();
			return false;
		}
		
		var form_status = $('<div class="form_status"></div>');
		$.ajax({
			url: 'mail_handler.php',
			type: 'POST',
			data: {
				name: name,
				email: email,
				phone: phone,
				msg: msg
			},
			beforeSend: function(){
				$('.respuesta').html('<div class="alert alert-info"><i class="fa fa-spinner fa-spin"></i> Enviando mensaje...</div>').fadeIn();
			},
			success: function(data){
				$('.respuesta').html('<div class="alert alert-success">¡Gracias por contactarnos! Pronto nos pondremos en contacto contigo.</div>').fadeIn();
				form[0].reset();
			},
			error: function(){
				$('.respuesta').html('<div class="alert alert-danger">Error al enviar el mensaje. Por favor, inténtelo nuevamente.</div>').fadeIn();
			}
		});
	});

	// Performance optimizations
	
	// Debounce function for scroll events
	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	// Apply debounce to scroll events
	$(window).scroll(debounce(function() {
		Scroll();
	}, 10));

	// Parallax effect mejorado
	$(window).scroll(debounce(function() {
		var scrolled = $(window).scrollTop();
		var parallaxElements = $('.parallax');
		
		parallaxElements.each(function() {
			var speed = 0.5;
			var yPos = -(scrolled * speed);
			$(this).css('background-position', 'center ' + yPos + 'px');
		});
	}, 16));

	//Google Map mejorado
	var latitude = $('#google-map').data('latitude') || -12.0464;
	var longitude = $('#google-map').data('longitude') || -77.0428;
	
	function initialize_map() {
		if (typeof google === 'undefined') return;
		
		var myLatlng = new google.maps.LatLng(latitude, longitude);
		var mapOptions = {
			zoom: 16,
			scrollwheel: false,
			center: myLatlng,
			styles: [
				{
					"featureType": "all",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"weight": "2.00"
						}
					]
				},
				{
					"featureType": "all",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#9c9c9c"
						}
					]
				}
			]
		};
		
		var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
		var contentString = '';
		var infowindow = new google.maps.InfoWindow({
			content: '<div class="map-content"><ul class="address">' + $('.address').html() + '</ul></div>'
		});
		
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: 'CREINFOR'
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, marker);
		});
	}
	
	// Cargar mapa solo cuando sea visible
	$('#contact').bind('inview', function(event, visible) {
		if (visible && typeof google !== 'undefined') {
			initialize_map();
			$(this).unbind('inview');
		}
	});

	// Service Worker para cache (PWA básico)
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('/sw.js').then(function(registration) {
				console.log('SW registered: ', registration);
			}).catch(function(registrationError) {
				console.log('SW registration failed: ', registrationError);
			});
		});
	}

	// Analytics tracking mejorado
	function trackEvent(category, action, label) {
		if (typeof gtag !== 'undefined') {
			gtag('event', action, {
				event_category: category,
				event_label: label
			});
		}
	}

	// Track clicks en servicios
	$('.service-icon').parent().click(function() {
		var serviceName = $(this).find('h3').text();
		trackEvent('Servicios', 'Click', serviceName);
	});

	// Track form submissions
	$('#contact-form').submit(function() {
		trackEvent('Contacto', 'Form Submit', 'Contact Form');
	});

	// Smooth animations on scroll
	$(window).scroll(debounce(function() {
		$('.wow').each(function() {
			if ($(this).hasClass('animated')) return;
			
			var elementTop = $(this).offset().top;
			var windowBottom = $(window).scrollTop() + $(window).height();
			
			if (elementTop < windowBottom - 100) {
				$(this).addClass('animated fadeInUp');
			}
		});
	}, 100));

	// Touch Support Mejorado para Carruseles (Mobile First)
	function initTouchSupport() {
		let startX = 0;
		let startY = 0;
		let distX = 0;
		let distY = 0;
		let threshold = 80; // Sensibilidad optimizada para móvil
		let restraint = 100; // Máxima distancia perpendicular
		let allowedTime = 500; // Tiempo máximo para el gesto
		let elapsedTime = 0;
		let startTime = 0;
		let isScrolling = undefined;

		// Aplicar a todos los carruseles
		$('.carousel').each(function() {
			const carousel = $(this);
			const carouselElement = this;
			
			carouselElement.addEventListener('touchstart', function(e) {
				const touchobj = e.changedTouches[0];
				startX = touchobj.pageX;
				startY = touchobj.pageY;
				startTime = new Date().getTime();
				isScrolling = undefined;
			}, { passive: true });

			carouselElement.addEventListener('touchmove', function(e) {
				const touchobj = e.changedTouches[0];
				distX = touchobj.pageX - startX;
				distY = touchobj.pageY - startY;
				
				// Determinar dirección del gesto
				if (typeof isScrolling == 'undefined') {
					isScrolling = !!(isScrolling || Math.abs(distX) < Math.abs(distY));
				}
				
				// Prevenir scroll vertical si es swipe horizontal
				if (!isScrolling && Math.abs(distX) > 10) {
					e.preventDefault();
					
					// Feedback visual sutil durante swipe
					const currentItem = carousel.find('.item.active');
					const translateX = Math.max(-50, Math.min(50, distX / 8));
					currentItem.css({
						'transform': `translateX(${translateX}px)`,
						'transition': 'none'
					});
				}
			}, { passive: false });

			carouselElement.addEventListener('touchend', function(e) {
				const touchobj = e.changedTouches[0];
				distX = touchobj.pageX - startX;
				distY = touchobj.pageY - startY;
				elapsedTime = new Date().getTime() - startTime;
				
				// Resetear transformación
				carousel.find('.item.active').css({
					'transform': '',
					'transition': ''
				});
				
				// Ejecutar cambio de slide si cumple condiciones
				if (!isScrolling && 
					elapsedTime <= allowedTime && 
					Math.abs(distX) >= threshold && 
					Math.abs(distY) <= restraint) {
					
					// Haptic feedback si está disponible
					if (navigator.vibrate) {
						navigator.vibrate(50);
					}
					
					if (distX > 0) {
						carousel.carousel('prev');
					} else {
						carousel.carousel('next');
					}
				}
			}, { passive: true });
		});

		// Mejorar indicadores táctiles
		$('.carousel-indicators li').on('touchstart', function(e) {
			$(this).addClass('touched');
		}).on('touchend', function(e) {
			const $this = $(this);
			const index = $this.index();
			const carousel = $this.closest('.carousel');
			
			carousel.carousel(index);
			$this.removeClass('touched');
			
			// Haptic feedback
			if (navigator.vibrate) {
				navigator.vibrate(30);
			}
		});
	}

	// Inicializar soporte touch
	initTouchSupport();

	// Mejorar experiencia móvil
	function enhanceMobileExperience() {
		// Detectar dispositivo táctil
		if ('ontouchstart' in window) {
			$('body').addClass('touch-device');
			
			// Mejorar hover effects en móvil
			$('.service-icon').parent().on('touchstart', function() {
				$(this).addClass('mobile-active');
				setTimeout(() => {
					$(this).removeClass('mobile-active');
				}, 300);
			});
		}

		// Optimizar para diferentes tamaños de pantalla
		function handleResize() {
			const width = $(window).width();
			
			if (width < 768) {
				// Móvil
				$('.carousel').carousel({
					interval: 8000, // Más tiempo en móvil
					pause: 'hover'
				});
			} else {
				// Tablet/Desktop
				$('.carousel').carousel({
					interval: 6000,
					pause: 'hover'
				});
			}
		}

		$(window).resize(debounce(handleResize, 250));
		handleResize(); // Ejecutar al cargar
	}

	// Inicializar mejoras móviles
	enhanceMobileExperience();

	// Efecto especial para hero description
	function initHeroDescriptionEffects() {
		const heroLines = $('.hero-description p');
		
		// Añadir efecto de aparición secuencial
		heroLines.each(function(index) {
			const $line = $(this);
			const delay = (index + 1) * 300; // 300ms entre cada línea
			
			setTimeout(() => {
				$line.addClass('animated fadeInUp');
				
				// Efecto de subrayado en highlights
				$line.find('.highlight').each(function() {
					const $highlight = $(this);
					setTimeout(() => {
						$highlight.addClass('highlight-active');
					}, 500);
				});
			}, delay);
		});

		// Efecto typewriter para el texto principal (opcional)
		function typeWriterEffect() {
			const lines = [
				"Transformamos visiones en realidad digital.",
				"Servicios de Inteligencia Artificial",
				"y desarrollo a medida que elevan tu negocio",
				"al siguiente nivel tecnológico."
			];
			
			// Este efecto se puede activar alternativamente
			// por ahora usamos las animaciones CSS
		}
	}

	// Inicializar efectos hero cuando el slider sea visible
	$('#home-slider').bind('inview', function(event, visible) {
		if (visible) {
			setTimeout(initHeroDescriptionEffects, 1000);
			$(this).unbind('inview');
		}
	});

	// Activar inmediatamente si ya está visible
	if ($('#home-slider').is(':visible')) {
		setTimeout(initHeroDescriptionEffects, 1000);
	}

	// ========================================
	// ABOUT US SECTION - EFECTOS INTERACTIVOS
	// ========================================

	function initAboutUsEffects() {
		// Animación de contadores estadísticos
		function animateStats() {
			$('.stat-item').each(function() {
				const $this = $(this);
				const counter = parseInt($this.data('counter'));
				const $number = $this.find('.stat-number');
				
				$({ countNum: 0 }).animate({ countNum: counter }, {
					duration: 2000,
					easing: 'swing',
					step: function() {
						$number.text(Math.floor(this.countNum) + '+');
					},
					complete: function() {
						$number.text(counter + '+');
					}
				});
			});
		}

		// Animación de barras de habilidades
		function animateSkillBars() {
			$('.skill-bar').each(function() {
				const $this = $(this);
				const skillPercentage = $this.data('skill');
				const $progress = $this.find('.skill-progress');
				
				setTimeout(() => {
					$progress.css('width', skillPercentage + '%');
				}, 500);
			});
		}

		// Efectos hover para tarjetas de certificación
		function initCertificationEffects() {
			$('.cert-card').hover(
				function() {
					$(this).find('.cert-icon').addClass('animated bounceIn');
				},
				function() {
					$(this).find('.cert-icon').removeClass('animated bounceIn');
				}
			);
		}

		// Efecto parallax para elementos flotantes
		function initFloatingTechIcons() {
			$(window).scroll(function() {
				const scrollTop = $(window).scrollTop();
				const windowHeight = $(window).height();
				const aboutOffset = $('#about-us').offset().top;
				
				if (scrollTop + windowHeight > aboutOffset && scrollTop < aboutOffset + $('#about-us').height()) {
					$('.tech-icon').each(function(index) {
						const speed = 0.5 + (index * 0.1);
						const yPos = (scrollTop - aboutOffset) * speed;
						$(this).css('transform', `translateY(${yPos}px) rotate(${scrollTop * 0.1}deg)`);
					});
				}
			});
		}

		// Efecto de escritura para el texto principal
		function initTypingEffect() {
			const $companyName = $('.company-name');
			const text = $companyName.text();
			$companyName.text('');
			
			let i = 0;
			const typeWriter = setInterval(() => {
				if (i < text.length) {
					$companyName.text($companyName.text() + text.charAt(i));
					i++;
				} else {
					clearInterval(typeWriter);
					$companyName.addClass('typing-complete');
				}
			}, 150);
		}

		// Intersección para activar animaciones
		function initScrollAnimations() {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const target = $(entry.target);
						
						// Activar contador de estadísticas
						if (target.hasClass('company-stats') && !target.hasClass('animated-stats')) {
							target.addClass('animated-stats');
							animateStats();
						}
						
						// Activar barras de habilidades
						if (target.hasClass('expertise-container') && !target.hasClass('animated-skills')) {
							target.addClass('animated-skills');
							animateSkillBars();
						}
						
						// Efecto de escritura para el nombre de empresa
						if (target.hasClass('logo-highlight') && !target.hasClass('typing-started')) {
							target.addClass('typing-started');
							setTimeout(initTypingEffect, 800);
						}
					}
				});
			}, {
				threshold: 0.3,
				rootMargin: '0px 0px -10% 0px'
			});

			// Observar elementos clave
			$('.company-stats, .expertise-container, .logo-highlight').each(function() {
				observer.observe(this);
			});
		}

		// Efecto de partículas reactivas al mouse
		function initInteractiveParticles() {
			$('.about-section-dark').mousemove(function(e) {
				const $this = $(this);
				const offset = $this.offset();
				const x = ((e.pageX - offset.left) / $this.width()) * 100;
				const y = ((e.pageY - offset.top) / $this.height()) * 100;
				
				$('.particle-dot').each(function(index) {
					const delay = index * 50;
					const $particle = $(this);
					
					setTimeout(() => {
						$particle.css({
							'transform': `translate(${(x - 50) * 0.1}px, ${(y - 50) * 0.1}px)`,
							'opacity': '0.8'
						});
					}, delay);
				});
			}).mouseleave(function() {
				$('.particle-dot').css({
					'transform': 'translate(0, 0)',
					'opacity': '0.3'
				});
			});
		}

		// Efecto de glassmorphism dinámico
		function initGlassMorphism() {
			$('.about-glass-card, .cert-card').hover(
				function() {
					$(this).css({
						'backdrop-filter': 'blur(25px)',
						'-webkit-backdrop-filter': 'blur(25px)'
					});
				},
				function() {
					$(this).css({
						'backdrop-filter': 'blur(20px)',
						'-webkit-backdrop-filter': 'blur(20px)'
					});
				}
			);
		}

		// Inicializar todos los efectos
		if ($('#about-us').length) {
			initScrollAnimations();
			initCertificationEffects();
			initFloatingTechIcons();
			initInteractiveParticles();
			initGlassMorphism();
			
			// Retrasar algunos efectos para mejor UX
			setTimeout(() => {
				$('.about-particles').addClass('particles-active');
				$('.floating-tech-elements').addClass('tech-active');
			}, 1000);
		}
	}

	// Función para optimizar rendimiento de animaciones
	function optimizeAboutAnimations() {
		// Usar requestAnimationFrame para animaciones suaves
		let ticking = false;
		
		function updateAnimations() {
			// Actualizar posiciones de elementos flotantes
			const scrollTop = $(window).scrollTop();
			
			if ($('#about-us').length) {
				$('.tech-icon').each(function(index) {
					const speed = 0.3 + (index * 0.05);
					const yPos = scrollTop * speed;
					this.style.transform = `translateY(${yPos}px)`;
				});
			}
			
			ticking = false;
		}
		
		$(window).scroll(() => {
			if (!ticking) {
				requestAnimationFrame(updateAnimations);
				ticking = true;
			}
		});
	}

	// Inicializar efectos de About Us
	$(document).ready(function() {
		initAboutUsEffects();
		optimizeAboutAnimations();
	});

});

// Función para mejorar Core Web Vitals
(function() {
	// Preload critical resources
	function preloadResource(href, as, type) {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.href = href;
		link.as = as;
		if (type) link.type = type;
		document.head.appendChild(link);
	}

	// Preload fonts críticas
	preloadResource('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap', 'style');

	// Optimize images
	function optimizeImages() {
		const images = document.querySelectorAll('img');
		images.forEach(img => {
			if (!img.loading) img.loading = 'lazy';
			if (!img.decoding) img.decoding = 'async';
		});
	}

	document.addEventListener('DOMContentLoaded', optimizeImages);
})();

