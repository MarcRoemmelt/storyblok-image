import LazyResponsiveImage from './LazyResponsiveImage.vue';



const plugin = {
	install(Vue, options = {}) {
		Vue.component('sb-image', LazyResponsiveImage);
	}
}
export LazyResponsiveImage;

export default plugin;