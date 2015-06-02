$(document).ready(function(){
	//alert()
	$("form.delete.subscriptions").submit(function(e){
		e.preventDefault();
		var $this = $(this)
		var url = $this.attr('action')//+'?'+$(this).serialize()
		//alert(url)
		console.log(url)
		$.ajax({
		    url: url,
		    type: 'DELETE',
		    success: function(result) {
		        // Do something with the result
		        console.log('delete successful')
		        console.log(result)
		        $('.btn-success').removeClass('btn-success').addClass('btn-default')
		        $this.find('button.btn').removeClass('btn-default').addClass('btn-success')
		        $("form.get.subscriptions").submit()
		    }
		});
	})

	$("form.get.subscriptions").submit(function(e){
		e.preventDefault()
		var url = $(this).attr('action')+"?"+$(this).serialize()
		console.log(url)
		$.ajax({
			url: url,
			dataType:'jsonp',
			type: 'GET',
			success: function(result){
				console.log(result)
				if(result.data.length >0){
					var html = '<ul class="list-unstyled list-group col-md-7">'
					for(var i = 0; i < result.data.length; i++){
						html+= '<li class="list-group-item">'
						html+= '<ul class="list-inline">'
						html+= '<li> id: '+result.data[i].id+'</li>'
						html+= '<li> object: '+result.data[i].object+'</li>'
						html+= '<li> object_id: '+result.data[i].object_id+'</li>'
						html+= '</ul>'
						html+= '</li>';
					}
					html += '</ul>'
				}else{
					var html = "<h4>No Current Subscriptions</h4>"
				}

				$('section.current.subscriptions').html(html)
			}
		})
	})

	//Can't figure out why this post won't work with ajax?
	//Anyone?
	$("form.post.subscriptions").submit(function(e){


		e.preventDefault();
		var $this = $(this)
		var url = $this.attr('action')//+'?'+$(this).serialize()
		var data = decodeURIComponent($this.serialize())
		var regex = new RegExp('/','g')
		data = data.replace(regex, '\/')
		//console.log(data)

		console.log("POST "+url)
		console.log("DATA: "+data)
		$.ajax({
		    url: url,
		    type: 'post',
		    data: data,
		    success: function(result) {
		        // Do something with the result
		        //console.log('POST successful')
		        $('.btn-success').removeClass('btn-success').addClass('btn-default')
						console.log(result)
		        if(result.meta.code == 200){
		        	console.log('POST successful')
		        	$("form.get.subscriptions").submit()
		        	$this.find('input').val('')
		        	$this.find('button.btn').removeClass('btn-default').addClass('btn-success')
		        }else{
		        	console.log('POST failed')
			        $this.find('button.btn').removeClass('btn-default').addClass('btn-error')
		        }
		    }
		});



	})

	//make a request to our get to list our all subscriptions
	$("form.get.subscriptions").submit()

})
