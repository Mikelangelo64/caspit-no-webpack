var vevet = new Vevet.Application({
    tablet: 1199,
    phone: 899,
    prefix: 'v-',
    viewportResizeTimeout: 100,
    easing: [0.25, 0.1, 0.25, 1]
});
vevet.pageLoad.onLoaded(function () {
    var videoHandler = function () {
        var videoArr = document.querySelectorAll('.video');
        if (videoArr.length === 0) {
            return;
        }
        videoArr.forEach(function (video) {
            if (!video) {
                return;
            }
            var source = video.querySelector('source');
            if (!source) {
                return;
            }
            var dataSrc = source.dataset.src;
            if (!dataSrc) {
                return;
            }
            source.src = dataSrc;
            video.load();
            video.addEventListener('loadeddata', function () {
                setTimeout(function () {
                    video.classList.add('loaded');
                }, 0);
            });
        });
    };
    videoHandler();
    var scrollBarInit = function () {
        var scrollBar;
        if (!vevet.isMobile) {
            scrollBar = new Vevet.ScrollBar({ container: window });
        }
        return scrollBar;
    };
    scrollBarInit();
    var useObserver = function (_a) {
        var target = _a.target, callbackIn = _a.callbackIn, callbackOut = _a.callbackOut, _b = _a.isCallOnce, isCallOnce = _b === void 0 ? false : _b;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var element = entry.target;
                if (entry.isIntersecting) {
                    // console.log(entry, element);
                    if (!callbackIn) {
                        return;
                    }
                    callbackIn(element);
                    if (isCallOnce) {
                        observer.unobserve(element);
                    }
                }
                else {
                    if (!callbackOut) {
                        return;
                    }
                    callbackOut(element);
                }
            }, {
                root: null,
                threshold: 0,
                rootMargin: '0px 0px 0px 0px'
            });
        });
        if (!target) {
            return undefined;
        }
        observer.observe(target);
        return observer;
    };
    var createAnimation = function (_a) {
        var itemProp = _a.itemProp, duration = _a.duration, animation = _a.animation;
        var item = itemProp;
        var timeline = new Vevet.Timeline({
            duration: duration,
            destroyOnEnd: true
        });
        timeline.addCallback('progress', function (_a) {
            var easing = _a.easing;
            switch (animation) {
                case 'fadeIn':
                    item.style.opacity = "".concat(easing);
                    break;
                case 'fadeInUp':
                    item.style.transform = "translate(0, ".concat((1 - easing) * 50, "px)");
                    item.style.opacity = "".concat(easing);
                    break;
                case 'fadeInLeft':
                    item.style.transform = "translate(".concat((easing - 1) * 20, "px, 0)");
                    item.style.opacity = "".concat(easing);
                    break;
                case 'fadeInRightBottom':
                    item.style.transform = "translate(\n            ".concat((1 - easing) * 20, "px, \n            ").concat((1 - easing) * 20, "px)");
                    item.style.opacity = "".concat(easing);
                    break;
                case 'fadeInRightUp':
                    item.style.transform = "translate(\n            ".concat((1 - easing) * 20, "px, \n            ").concat((easing - 1) * 30, "px)");
                    item.style.opacity = "".concat(easing);
                    break;
                default:
                    item.style.opacity = '';
            }
        });
        timeline.addCallback('end', function () {
            item.classList.add('showed');
        });
        timeline.addCallback('destroy', function () {
            item.style.opacity = '';
            item.style.transform = '';
        });
        timeline.play();
    };
    var createObserver = function (item, container) {
        var delay = item.dataset.delay ? +item.dataset.delay : 0;
        if (Number.isNaN(delay)) {
            return;
        }
        var duration = item.dataset.duration ? +item.dataset.duration : 1000;
        if (Number.isNaN(duration)) {
            return;
        }
        var animation = item.dataset.animation
            ? item.dataset.animation
            : 'fadeIn';
        useObserver({
            target: container,
            callbackIn: function () {
                setTimeout(function () {
                    createAnimation({ itemProp: item, duration: duration, animation: animation });
                }, delay);
            },
            isCallOnce: true
        });
    };
    var showAnimationInit = function () {
        if (vevet.isMobile) {
            return;
        }
        var containerArray = document.querySelectorAll('.show-animation');
        if (containerArray.length === 0) {
            return;
        }
        containerArray.forEach(function (container) {
            var itemsArray = container.querySelectorAll('.show-animation__item');
            if (itemsArray.length === 0) {
                return;
            }
            itemsArray.forEach(function (item) {
                createObserver(item, container);
            });
        });
    };
    showAnimationInit();
    var useOutsideClick = function (element, callback) {
        var listener = function (event) {
            if (!element.contains(event === null || event === void 0 ? void 0 : event.target) && event.which === 1) {
                callback();
            }
        };
        document.addEventListener('mousedown', listener);
    };
    var useOnEscape = function (callback) {
        window.addEventListener('keydown', function (evt) {
            if (evt.keyCode === 27) {
                callback();
            }
        });
    };
    var renderModalAnimation = function (_a) {
        var progress = _a.progress, easing = _a.easing, parent = _a.parent, overlay = _a.overlay, scroll = _a.scroll, additional = _a.additional;
        if (parent) {
            var element = parent;
            element.style.display = "".concat(progress > 0 ? 'flex' : 'none');
            element.style.opacity = "".concat(progress > 0 ? 1 : 0);
        }
        if (overlay) {
            var element = overlay;
            element.style.opacity = "".concat(easing);
        }
        if (scroll) {
            var element = scroll;
            element.style.opacity = "".concat(easing);
            if (parent.classList.contains('popup-menu')) {
                element.style.transform = "translateX(".concat((1 - easing) * 100, "%)");
            }
            else {
                element.style.transform = "translateY(".concat((1 - easing) * 2, "rem)");
            }
        }
        if (additional) {
            var element = additional;
            element.style.opacity = "".concat(easing);
            if (parent.classList.contains('popup-menu')) {
                element.style.transform = "translateX(".concat((1 - easing) * 100, "%)");
            }
            else {
                element.style.transform = "translateY(".concat((1 - easing) * 2, "rem)");
            }
        }
    };
    var makeTimeline = function (parent, scroll, overlay, additional, video) {
        if (!parent || !scroll || !overlay) {
            return undefined;
        }
        var timeline = new Vevet.Timeline({
            duration: 600,
            easing: [0.25, 0.1, 0.25, 1]
        });
        timeline.addCallback('start', function () {
            var _a, _b;
            if (!timeline.isReversed) {
                (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.add('lock');
                (_b = document.querySelector('body')) === null || _b === void 0 ? void 0 : _b.classList.add('lock');
                parent.classList.add('_opened');
                if (video) {
                    video.play();
                }
            }
        });
        timeline.addCallback('progress', function (_a) {
            var progress = _a.progress, easing = _a.easing;
            renderModalAnimation({
                parent: parent,
                scroll: scroll,
                overlay: overlay,
                progress: progress,
                easing: easing,
                additional: additional
            });
        });
        timeline.addCallback('end', function () {
            var _a, _b;
            if (timeline.isReversed) {
                (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.remove('lock');
                (_b = document.querySelector('body')) === null || _b === void 0 ? void 0 : _b.classList.remove('lock');
                parent.classList.remove('_opened');
                if (video) {
                    video.pause();
                }
            }
        });
        return timeline;
    };
    var Popup = /** @class */ (function () {
        function Popup(domElement) {
            var _this = this;
            this._isThanks = false;
            this._isError = false;
            this._closeButtons = [];
            this._openButtons = [];
            this._parent = domElement;
            this._name = domElement.dataset.popupname;
            this._scroll = this._parent.querySelector('.popup__scroll');
            this._overlay = this._parent.querySelector('.popup__overlay');
            this._wrapper = this._parent.querySelector('.popup__wrapper');
            this._additional = this._parent.querySelector('.popup__additional');
            this._video = this._parent.querySelector('.video');
            if (!this._name || !this._scroll || !this._overlay || !this._wrapper) {
                return;
            }
            this._isThanks = this._name === '_popup-thanks';
            this._isError = this._name === '_popup-error';
            this._timeline = makeTimeline(this._parent, this._scroll, this._overlay, this._additional, this._video);
            this._openButtons = Array.from(document.querySelectorAll("[data-popup=\"".concat(this._name, "\"]")));
            this._closeButtons = Array.from(this._parent.querySelectorAll('.popup__close, .popup__button'));
            if (this._closeButtons.length !== 0) {
                this._closeButtons.forEach(function (button) {
                    if (!button) {
                        return;
                    }
                    button.addEventListener('click', function () {
                        var _a;
                        (_a = _this._timeline) === null || _a === void 0 ? void 0 : _a.reverse();
                    });
                });
            }
            useOutsideClick(this._wrapper, function () {
                var _a, _b, _c, _d;
                if (_this._parent.classList.contains('_opened')) {
                    (_a = _this._timeline) === null || _a === void 0 ? void 0 : _a.reverse();
                    (_b = document.querySelector('html')) === null || _b === void 0 ? void 0 : _b.classList.remove('lock');
                    (_c = document.querySelector('body')) === null || _c === void 0 ? void 0 : _c.classList.remove('lock');
                    (_d = _this._video) === null || _d === void 0 ? void 0 : _d.pause();
                }
            });
            useOnEscape(function () {
                var _a, _b, _c, _d;
                if (_this._parent.classList.contains('_opened')) {
                    (_a = _this._timeline) === null || _a === void 0 ? void 0 : _a.reverse();
                    (_b = document.querySelector('html')) === null || _b === void 0 ? void 0 : _b.classList.remove('lock');
                    (_c = document.querySelector('body')) === null || _c === void 0 ? void 0 : _c.classList.remove('lock');
                    (_d = _this._video) === null || _d === void 0 ? void 0 : _d.pause();
                }
            });
        }
        Object.defineProperty(Popup.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "isThanks", {
            get: function () {
                return this._isThanks;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "isError", {
            get: function () {
                return this._isError;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "scroll", {
            get: function () {
                return this._scroll;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "overlay", {
            get: function () {
                return this._overlay;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "additional", {
            get: function () {
                return this._additional;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "wrapper", {
            get: function () {
                return this._wrapper;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "video", {
            get: function () {
                return this._video;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "timeline", {
            get: function () {
                return this._timeline;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "closeButtons", {
            get: function () {
                return this._closeButtons;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "openButtons", {
            get: function () {
                return this._openButtons;
            },
            enumerable: false,
            configurable: true
        });
        Popup.prototype.initOpen = function (popupArr) {
            var _this = this;
            if (popupArr.length === 0 || !this._openButtons) {
                return;
            }
            this._openButtons.forEach(function (openBtn) {
                openBtn.addEventListener('click', function (evt) {
                    var _a;
                    evt.preventDefault();
                    popupArr.forEach(function (popup) {
                        var _a;
                        if (popup.parent.classList.contains('_opened') &&
                            popup.name !== _this._name) {
                            (_a = popup.timeline) === null || _a === void 0 ? void 0 : _a.reverse();
                        }
                    });
                    (_a = _this._timeline) === null || _a === void 0 ? void 0 : _a.play();
                });
            });
        };
        return Popup;
    }());
    var initPopups = function () {
        var popupDomArr = document.querySelectorAll('.popup');
        if (popupDomArr.length === 0) {
            return [];
        }
        var popupArr = [];
        popupDomArr.forEach(function (element) {
            var popup = new Popup(element);
            popupArr.push(popup);
        });
        popupArr.forEach(function (popup) {
            popup.initOpen(popupArr);
        });
        return popupArr;
    };
    var popups = initPopups();
    //anchorsInit
    var closePopupsHandler = function (popups) {
        if (popups.length === 0) {
            return;
        }
        popups.forEach(function (_a) {
            var timeline = _a.timeline, openButtons = _a.openButtons;
            if (timeline && timeline.progress > 0) {
                timeline.reverse();
                openButtons.forEach(function (openBtn) {
                    openBtn.classList.remove('_opened');
                });
            }
        });
    };
    var scrollHandler = function (link, headerHeight, popups) {
        var sectionName = link.dataset.goto;
        if (!sectionName) {
            return;
        }
        var section = document.querySelector("".concat(sectionName));
        if (!section) {
            return;
        }
        link.addEventListener('click', function (evt) {
            evt.preventDefault();
            closePopupsHandler(popups);
            window.scrollTo({
                top: section.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    };
    var anchorsInit = function (headerHeight, popups) {
        var links = Array.from(document.querySelectorAll('.anchor'));
        if (links.length === 0) {
            return;
        }
        links.forEach(function (link) {
            scrollHandler(link, headerHeight, popups);
        });
    };
    anchorsInit(0, popups);
    var formArr = document.querySelectorAll('form');
    var hasError = false;
    if (formArr.length !== 0) {
        // formArr.forEach((form) => {
        //   form.addEventListener('submit', (evt) => {
        //     evt.preventDefault();
        //     const inputs = Array.from(
        //       form.querySelectorAll('input, textarea') as NodeListOf<
        //         HTMLInputElement | HTMLTextAreaElement
        //       >
        //     );
        //     popups.forEach(({ timeline, isThanks, isError }) => {
        //       if (isThanks && !hasError) {
        //         timeline?.play();
        //         if (inputs.length !== 0) {
        //           inputs.forEach((inputProp) => {
        //             const input = inputProp;
        //             input.value = '';
        //           });
        //         }
        //       } else if (isError && hasError) {
        //         timeline?.play();
        //       } else {
        //         timeline?.reverse();
        //       }
        //     });
        //   });
        // });
        document.addEventListener('wpcf7mailsent', function () {
            popups.forEach(function (_a) {
                var timeline = _a.timeline, isThanks = _a.isThanks, isError = _a.isError;
                if (isThanks && !hasError) {
                    timeline === null || timeline === void 0 ? void 0 : timeline.play();
                    formArr.forEach(function (form) {
                        var inputs = Array.from(form.querySelectorAll('input, textarea'));
                        if (inputs.length !== 0) {
                            inputs.forEach(function (inputProp) {
                                var input = inputProp;
                                input.value = '';
                            });
                        }
                    });
                }
                else if (isError && hasError) {
                    timeline === null || timeline === void 0 ? void 0 : timeline.play();
                }
                else {
                    timeline === null || timeline === void 0 ? void 0 : timeline.reverse();
                }
            });
        }, false);
    }
});
