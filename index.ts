const vevet = new Vevet.Application({
  tablet: 1199,
  phone: 899,
  prefix: 'v-',
  viewportResizeTimeout: 100,
  easing: [0.25, 0.1, 0.25, 1],
});

vevet.pageLoad.onLoaded(() => {
  const videoHandler = () => {
    const videoArr = document.querySelectorAll(
      '.video'
    ) as NodeListOf<HTMLVideoElement>;

    if (videoArr.length === 0) {
      return;
    }

    videoArr.forEach((video) => {
      if (!video) {
        return;
      }

      const source = video.querySelector('source');

      if (!source) {
        return;
      }

      const dataSrc = source.dataset.src;

      if (!dataSrc) {
        return;
      }

      source.src = dataSrc;

      video.load();

      video.addEventListener('loadeddata', () => {
        setTimeout(() => {
          video.classList.add('loaded');
        }, 0);
      });
    });
  };

  videoHandler();

  const scrollBarInit = () => {
    let scrollBar;
    if (!vevet.isMobile) {
      scrollBar = new Vevet.ScrollBar({ container: window });
    }

    return scrollBar;
  };

  scrollBarInit();

  //config
  //useobserver
  type TCallback = (element: Element) => void;

  interface IUseObserverProps {
    target: HTMLElement | null;
    callbackIn?: TCallback;
    callbackOut?: TCallback;
    isCallOnce?: boolean;
  }

  const useObserver: (
    props: IUseObserverProps
  ) => IntersectionObserver | undefined = ({
    target,
    callbackIn,
    callbackOut,
    isCallOnce = false,
  }) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => {
          const element = entry.target;

          if (entry.isIntersecting) {
            // console.log(entry, element);
            if (!callbackIn) {
              return;
            }
            callbackIn(element);

            if (isCallOnce) {
              observer.unobserve(element);
            }
          } else {
            if (!callbackOut) {
              return;
            }
            callbackOut(element);
          }
        },
        {
          root: null,
          threshold: 0,
          rootMargin: '0px 0px 0px 0px',
        }
      );
    });

    if (!target) {
      return undefined;
    }

    observer.observe(target);
    return observer;
  };

  //showAnimationInit
  type TAnimation =
    | 'fadeInUp'
    | 'fadeIn'
    | 'fadeInLeft'
    | 'fadeInRightBottom'
    | 'fadeInRightUp'
    | 'no-animate';

  interface ICreateAniamtionProps {
    itemProp: HTMLElement;
    duration: number;
    animation: TAnimation;
  }

  const createAnimation: (props: ICreateAniamtionProps) => void = ({
    itemProp,
    duration,
    animation,
  }) => {
    const item = itemProp;

    const timeline = new Vevet.Timeline({
      duration,
      destroyOnEnd: true,
    });

    timeline.addCallback('progress', ({ easing }) => {
      switch (animation) {
        case 'fadeIn':
          item.style.opacity = `${easing}`;
          break;

        case 'fadeInUp':
          item.style.transform = `translate(0, ${(1 - easing) * 50}px)`;
          item.style.opacity = `${easing}`;
          break;

        case 'fadeInLeft':
          item.style.transform = `translate(${(easing - 1) * 20}px, 0)`;
          item.style.opacity = `${easing}`;
          break;

        case 'fadeInRightBottom':
          item.style.transform = `translate(
            ${(1 - easing) * 20}px, 
            ${(1 - easing) * 20}px)`;

          item.style.opacity = `${easing}`;
          break;

        case 'fadeInRightUp':
          item.style.transform = `translate(
            ${(1 - easing) * 20}px, 
            ${(easing - 1) * 30}px)`;

          item.style.opacity = `${easing}`;
          break;

        default:
          item.style.opacity = '';
      }
    });

    timeline.addCallback('end', () => {
      item.classList.add('showed');
    });

    timeline.addCallback('destroy', () => {
      item.style.opacity = '';
      item.style.transform = '';
    });

    timeline.play();
  };

  const createObserver = (item: HTMLElement, container: HTMLElement) => {
    const delay = item.dataset.delay ? +item.dataset.delay : 0;

    if (Number.isNaN(delay)) {
      return;
    }

    const duration = item.dataset.duration ? +item.dataset.duration : 1000;

    if (Number.isNaN(duration)) {
      return;
    }

    const animation = item.dataset.animation
      ? (item.dataset.animation as TAnimation)
      : 'fadeIn';

    useObserver({
      target: container,
      callbackIn: () => {
        setTimeout(() => {
          createAnimation({ itemProp: item, duration, animation });
        }, delay);
      },
      isCallOnce: true,
    });
  };

  const showAnimationInit = () => {
    if (vevet.isMobile) {
      return;
    }

    const containerArray = document.querySelectorAll(
      '.show-animation'
    ) as NodeListOf<HTMLElement>;

    if (containerArray.length === 0) {
      return;
    }

    containerArray.forEach((container) => {
      const itemsArray = container.querySelectorAll(
        '.show-animation__item'
      ) as NodeListOf<HTMLElement>;

      if (itemsArray.length === 0) {
        return;
      }

      itemsArray.forEach((item) => {
        createObserver(item, container);
      });
    });
  };

  showAnimationInit();

  //popup
  //utils
  type TClickOutsideEvent = MouseEvent | TouchEvent;

  const useOutsideClick = (element: HTMLElement, callback: () => void) => {
    const listener = (event: TClickOutsideEvent) => {
      if (!element.contains(event?.target as Node) && event.which === 1) {
        callback();
      }
    };

    document.addEventListener('mousedown', listener);
  };

  const useOnEscape = (callback: () => void) => {
    window.addEventListener('keydown', (evt) => {
      if (evt.keyCode === 27) {
        callback();
      }
    });
  };

  interface IRenderModalAnimationProps {
    progress: number;
    easing: number;
    parent: HTMLElement;
    scroll: HTMLElement;
    overlay: HTMLElement;
    additional: HTMLElement | null;
  }

  const renderModalAnimation = ({
    progress,
    easing,
    parent,
    overlay,
    scroll,
    additional,
  }: IRenderModalAnimationProps) => {
    if (parent) {
      const element = parent;
      element.style.display = `${progress > 0 ? 'flex' : 'none'}`;
      element.style.opacity = `${progress > 0 ? 1 : 0}`;
    }

    if (overlay) {
      const element = overlay;
      element.style.opacity = `${easing}`;
    }

    if (scroll) {
      const element = scroll;
      element.style.opacity = `${easing}`;
      if (parent.classList.contains('popup-menu')) {
        element.style.transform = `translateX(${(1 - easing) * 100}%)`;
      } else {
        element.style.transform = `translateY(${(1 - easing) * 2}rem)`;
      }
    }

    if (additional) {
      const element = additional;
      element.style.opacity = `${easing}`;
      if (parent.classList.contains('popup-menu')) {
        element.style.transform = `translateX(${(1 - easing) * 100}%)`;
      } else {
        element.style.transform = `translateY(${(1 - easing) * 2}rem)`;
      }
    }
  };

  const makeTimeline = (
    parent: HTMLElement,
    scroll: HTMLElement | null,
    overlay: HTMLElement | null,
    additional: HTMLElement | null,
    video?: HTMLVideoElement | null
  ) => {
    if (!parent || !scroll || !overlay) {
      return undefined;
    }

    const timeline = new Vevet.Timeline({
      duration: 600,
      easing: [0.25, 0.1, 0.25, 1],
    });
    timeline.addCallback('start', () => {
      if (!timeline.isReversed) {
        document.querySelector('html')?.classList.add('lock');
        document.querySelector('body')?.classList.add('lock');
        parent.classList.add('_opened');

        if (video) {
          video.play();
        }
      }
    });

    timeline.addCallback('progress', ({ progress, easing }) => {
      renderModalAnimation({
        parent,
        scroll,
        overlay,
        progress,
        easing,
        additional,
      });
    });

    timeline.addCallback('end', () => {
      if (timeline.isReversed) {
        document.querySelector('html')?.classList.remove('lock');
        document.querySelector('body')?.classList.remove('lock');
        parent.classList.remove('_opened');

        if (video) {
          video.pause();
        }
      }
    });

    return timeline;
  };

  class Popup {
    get parent() {
      return this._parent;
    }

    private _parent: HTMLElement;

    get name() {
      return this._name;
    }

    private _name: string | undefined;

    get isThanks() {
      return this._isThanks;
    }

    private _isThanks: boolean = false;

    get isError() {
      return this._isError;
    }

    private _isError: boolean = false;

    get scroll() {
      return this._scroll;
    }

    private _scroll: HTMLElement | null;

    get overlay() {
      return this._overlay;
    }

    private _overlay: HTMLElement | null;

    get additional() {
      return this._additional;
    }

    private _additional: HTMLElement | null;

    get wrapper() {
      return this._wrapper;
    }

    private _wrapper: HTMLElement | null;

    get video() {
      return this._video;
    }

    private _video: HTMLVideoElement | null;

    get timeline() {
      return this._timeline;
    }

    private _timeline: Vevet.Timeline | undefined;

    get closeButtons() {
      return this._closeButtons;
    }

    private _closeButtons: Array<HTMLElement | null> = [];

    get openButtons() {
      return this._openButtons;
    }

    private _openButtons: HTMLElement[] = [];

    constructor(domElement: HTMLElement) {
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

      this._timeline = makeTimeline(
        this._parent,
        this._scroll,
        this._overlay,
        this._additional,
        this._video
      );

      this._openButtons = Array.from(
        document.querySelectorAll(`[data-popup="${this._name}"]`)
      );
      this._closeButtons = Array.from(
        this._parent.querySelectorAll(
          '.popup__close, .popup__button'
        ) as NodeListOf<HTMLElement>
      );

      if (this._closeButtons.length !== 0) {
        this._closeButtons.forEach((button) => {
          if (!button) {
            return;
          }

          button.addEventListener('click', () => {
            this._timeline?.reverse();
          });
        });
      }

      useOutsideClick(this._wrapper, () => {
        if (this._parent.classList.contains('_opened')) {
          this._timeline?.reverse();
          document.querySelector('html')?.classList.remove('lock');
          document.querySelector('body')?.classList.remove('lock');

          this._video?.pause();
        }
      });

      useOnEscape(() => {
        if (this._parent.classList.contains('_opened')) {
          this._timeline?.reverse();

          document.querySelector('html')?.classList.remove('lock');
          document.querySelector('body')?.classList.remove('lock');

          this._video?.pause();
        }
      });
    }

    initOpen(popupArr: Popup[]) {
      if (popupArr.length === 0 || !this._openButtons) {
        return;
      }
      this._openButtons.forEach((openBtn) => {
        openBtn.addEventListener('click', (evt) => {
          evt.preventDefault();

          popupArr.forEach((popup) => {
            if (
              popup.parent.classList.contains('_opened') &&
              popup.name !== this._name
            ) {
              popup.timeline?.reverse();
            }
          });

          this._timeline?.play();
        });
      });
    }
  }

  const initPopups = (): Popup[] => {
    const popupDomArr = document.querySelectorAll('.popup');

    if (popupDomArr.length === 0) {
      return [];
    }

    const popupArr: Popup[] = [];

    popupDomArr.forEach((element) => {
      const popup = new Popup(element as HTMLElement);
      popupArr.push(popup);
    });

    popupArr.forEach((popup) => {
      popup.initOpen(popupArr);
    });

    return popupArr;
  };

  const popups = initPopups();

  //anchorsInit
  const closePopupsHandler = (popups: Popup[]) => {
    if (popups.length === 0) {
      return;
    }

    popups.forEach(({ timeline, openButtons }) => {
      if (timeline && timeline.progress > 0) {
        timeline.reverse();

        openButtons.forEach((openBtn) => {
          openBtn.classList.remove('_opened');
        });
      }
    });
  };

  const scrollHandler = (
    link: HTMLElement,
    headerHeight: number,
    popups: Popup[]
  ) => {
    const sectionName = link.dataset.goto;
    if (!sectionName) {
      return;
    }

    const section = document.querySelector(
      `${sectionName}`
    ) as HTMLElement | null;
    if (!section) {
      return;
    }

    link.addEventListener('click', (evt) => {
      evt.preventDefault();

      closePopupsHandler(popups);

      window.scrollTo({
        top: section.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    });
  };

  const anchorsInit = (headerHeight: number, popups: Popup[]) => {
    const links = Array.from(
      document.querySelectorAll('.anchor') as NodeListOf<HTMLElement>
    );

    if (links.length === 0) {
      return;
    }

    links.forEach((link) => {
      scrollHandler(link, headerHeight, popups);
    });
  };

  anchorsInit(0, popups);

  const formArr = document.querySelectorAll('form');
  const hasError = false;

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

    document.addEventListener(
      'wpcf7mailsent',
      function () {
        popups.forEach(({ timeline, isThanks, isError }) => {
          if (isThanks && !hasError) {
            timeline?.play();

            formArr.forEach((form) => {
              const inputs = Array.from(
                form.querySelectorAll('input, textarea') as NodeListOf<
                  HTMLInputElement | HTMLTextAreaElement
                >
              );

              if (inputs.length !== 0) {
                inputs.forEach((inputProp) => {
                  const input = inputProp;
                  input.value = '';
                });
              }
            });
          } else if (isError && hasError) {
            timeline?.play();
          } else {
            timeline?.reverse();
          }
        });
      },
      false
    );
  }
});
