let LOAD_NUM = 4;
let watcher;
new Vue({
	el: "#app",
	data: {
		results: [],
		search:"cat",
		total: 0,
		products: [
		],
		cart:[],
		lastSearch: ""
	},
	filters: {
		currency: function (price) {
			return "$".concat(price.toFixed(2));
		}
	},
	created: function () {
		this.onSubmit();
	},
	methods: {
		appendResults: function(){
			if ( this.products.length < this.results.length){
				let toAppend = this.results.slice(this.products.length, LOAD_NUM+this.products.length);
				this.products = this.products.concat(toAppend)
			}
			},
		onSubmit: function(){
			this.products = [];
			this.results = [];
			let path = "/search?q=".concat(this.search);
			this.$http.get(path)
				.then(function (response) {
					this.lastSearch = this.search;
					this.results = response.body;
					this.appendResults();
				});
		},
		inc: function(item){
			item.qty ++;
			this.total += item.price;
		},
		dec: function(item){
			if( item.qty <= 0) {
				let i = this.cart.indexOf(item);
				this.cart.splice(i, 1);
			}
			item.qty --;
			this.total -= item.price;
		},


		addToCart: function (product) {
			this.total += product.price;
			let found = false;
			for (let i = 0; i < this.cart.length; i++) {
				if (this.cart[i].id === product.id) {
					this.cart[i].qty++;
					found = true;
				}
			}
			if (!found){
				this.cart.push({
					id: product.id,
					title: product.title,
					price: product.price,
					qty: 1
				});
			}

		}

	},
	updated: function () {
		let sensor = document.querySelector("#product-list-bottom");
		watcher = scrollMonitor.create(sensor);
		watcher.enterViewport(this.appendResults())
	},
	beforeUpdate: function () {
		if(watcher){
			watcher.destroy();
			watcher = null;
		}
	}
});

