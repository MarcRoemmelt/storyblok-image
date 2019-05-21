<template>
    <div
        class="lazy-responsive-image"
        :class="{ 'lazy-responsive-image_zoomable': zoom }"
    >
        <div
            class="lazy-responsive-image__placeholder"
            :style="style"
        />
        <div class="lazy-responsive-image__media">
            <img
                :src="thumbnailSource"
                class="lazy-responsive-image__thumbnail"
                :class="{ 'cover': cover }"
            >
            <transition name="fade">
                <img
                    id="image"
                    v-show="!loading"
                    :sizes="finalSizes"
                    :srcset="finalSrcset"
                    class="lazy-responsive-image__image"
                    :class="{ 'cover': cover }"
                >
            </transition>
        </div>
    </div>
</template>

<script>
export default {
  name: 'LazyResponsiveImage',
  props: {
    aspectRatio: {
        type: [Number, String],
        default: null
    },

    baseURL: {
        type: String,
        default: '/images',
    },

    breakpoints: {
        type: Array,
        default() {
            return [
                '440px',
                '620px',
                '960px',
                '1260px',
                '1540px',
                '2260px'
            ]
        }
    },

    cover: {
        type: Boolean,
        default: false
    },

    height: {
      type: [Number,String],
      default: null,
    },

    maxSize: {
        type: Number,
        default: 2400,
    },

    minSize: {
        type: Number,
        default: 200,
    },
    
    observerOptions: {
        type: Object,
        default() {
            return {
                root: null,
                rootMargin: '0px',
                threshold: 0,
            }
        }
    },

    sizes: {
        type: Array,
        default() {
            return [
                '100vw',
                '400px',
                '500px',
                '500px',
                '750px',
                '1200px'
            ]
        }
    },

    sizeStep: {
        type: Number,
        default: 200
    },

    src: {
      type: String,
      default: null,
    },

    webp: {
        type: Boolean,
        default: null
    },

    width: {
      type: [Number,String],
      default: null,
    },

    zoom: {
        type: Boolean,
        default: false
    }
  },

    data() {
        return {
            image: null,
            loading: true,
            webpSupport: false,

            finalSizes: '',
            finalSrcset: '',
            start: null,
        };
    },

    computed: {
        thumbnailSource() {
            return `${this.baseURL}/20x20/${this.src}`
        },

        imageRatio() {
            if (this.width && this.height) return (this.height / this.width) * 100;
            if (this.aspectRatio) return this.aspectRatio * 100;
            return 100;
        },

        style() {
            const style = {
                height: 0,
                paddingTop: `${this.imageRatio}%`,
                width: this.width ? `${this.width}px` : 'auto'
            };
            return style;
        },
    },

    mounted() {
        this.testWebpSupport();
        this.image = this.$el.querySelector('#image');
        const setLoadingState = () => {
          this.loading = false;
        };
        this.image.addEventListener('load', setLoadingState);
        this.$once('hook:destroyed', () => {
          this.image.removeEventListener('load', setLoadingState);
        });
        this.setObserver();
    },

    methods: {
        setObserver() {
            if (typeof window !== 'undefined' && window.IntersectionObserver) {
                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.intersectionRatio > 0 || entry.isIntersecting) {
                            observer.unobserve(entry.target)
                            this.loadImage()
                        }
                    });
                }, this.observerOptions);
                observer.observe(this.$el);
                return;
            }
            this.loadImage()
        },

        loadImage() {
            this.finalSrcset = this.srcsetString();
            this.finalSizes = this.sizesString();
        },

        testWebpSupport() {
            if (this.webp || document.body.classList.contains('webp-true')) {
                this.webpSupport = true;
                return;
            }
            if (this.webp === false || document.body.classList.contains('webp-false')) {
                this.webpSupport = false;
                return;
            }

            let webP = new Image();
            webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
            webP.onload = webP.onerror = () => {
                let support = webP.height === 2;
                let c = 'webp-' + (support).toString();
                document.body.classList.add(c);
                this.webpSupport = support;
            }
        },

        sizesString() {
            let sizes = '';
            for (let i = this.breakpoints.length -1 ; i > 0; i--) {
                sizes += `(min-width: ${this.breakpoints[i]}) ${this.sizes[i] || '100vw'},`;
            }
            return sizes + `${this.sizes[0] || '100vw'}`;
        },

        srcsetString() {
            let srcset = '';
            for (let i = this.minSize; i <= this.maxSize; i = i + this.sizeStep) {
                srcset += `${this.createImageURLwithSize(i)} ${i}w, \n`;
            }
            return srcset;
        },

        createImageURLwithSize(size) {
            let height = Math.round(size*this.imageRatio/100);
            return `${this.baseURL}/${size}x${height}/smart${this.webpSupport ? '/filters:format(webp)' : ''}${this.src}`;
        }
    }
};
</script>

<style lang="scss">
.lazy-responsive-image {
    position: relative;
    overflow: hidden;

  &__placeholder {
    position: relative;
    background-color: grey;
  }
  &__media {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }

  &__thumbnail {
    width: 100%;
    height: 100%;
    filter: blur(25px);
    z-index: 1;

    &.cover {
        object-fit: cover;
    }
  }

  &__image {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;

    &.cover {
        object-fit: cover;
    }
  }

  &_zoomable {
    .lazy-responsive-image__image {
        will-change: transform;
        transition: transform 350ms cubic-bezier(0.4, 0.0, 1, 1), opacity 400ms ease;

        &:hover {
            transform: scale(1.15);
        }
    }  
  }
}

.fade-enter {
    opacity: 0;
}
</style>
