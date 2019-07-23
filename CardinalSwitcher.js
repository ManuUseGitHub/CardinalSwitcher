'use strict';

var Cardinal = function(){
  
  /**
  * All credits for the base code of the matrix rotation there : 
  * [HTTP] http://jsfiddle.net/FloydPink/0fg4rLf9
  */
  class MatrixNRotator{
    // https://leetcode.com/discuss/20589/a-common-method-to-rotate-the-image
    /**
     * @param {number[][]} matrix
     * @return {void} Do not return anything, modify matrix in-place instead.
     */
    rotateClockwise(matrix) {
      // reverse the rows
      matrix = matrix.reverse();
      // swap the symmetric elements
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < i; j++) {
          var temp = matrix[i][j];
          matrix[i][j] = matrix[j][i];
          matrix[j][i] = temp;
        }
      }
    }

    /**
     * @param {number[][]} matrix
     * @return {void} Do not return anything, modify matrix in-place instead.
     */
    rotateCounterClockwise(matrix) {
      // reverse the individual rows
      matrix = matrix.map(function(row) {
        return row.reverse();
      });
      // swap the symmetric elements
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < i; j++) {
          var temp = matrix[i][j];
          matrix[i][j] = matrix[j][i];
          matrix[j][i] = temp;
        }
      }
    }

    rotate180degree(matrix){
      this.rotateClockwise(matrix);
      this.rotateClockwise(matrix);
    }
  }

  class CardinalSwitcher{
    constructor(){
      this.original = [
        ['TL', 'T-', 'TR'],
        ['L-', 'X-', 'R-'],
        ['BL', 'B-', 'BR']
      ];
      this.rotator = new MatrixNRotator();
    }

    getPosition(direction){
      var i=0;
      for(; i<3;++i){
        var j=0;
        for(; j<3;++j){
          var d = this.original;
          if(direction == d[i][j]){
            return {i:i,j:j}
          }
        } 
      }  
    }

    normalizeDirection(direction){
      if(direction.length < 2){
        direction=direction+'-';
      }
      else if(direction.length > 2){
        direction=/^(.{2}).*$/.exec(direction)[1];
      }
      return direction;
    }

    getDirectionCode(cls){
      var direction = '';
      var filters = ['.*(t)op.*','.*(b)ottom.*','.*(l)eft.*','.*(r)ight.*'];

      filters.forEach(function(e){
        var m;
        if(m = new RegExp(e).exec(cls)){
          if(!/(.)\1$/.test(direction+m[1])){
            direction+=(m[1]).toUpperCase()  
          }
        }
      })
      // narmalizing the resulted direction (to have maximum 2 characters for the direction)
      return this.normalizeDirection(direction)
    }

    normalizeOpitons(options){
      if(!options.type){
        throw 'You have to set options.type with one of these values ["opposit","clock","non-clock"]';
      }
      if(!options.from1){
        if(!options.from2){
          throw 'You have to set options.from1 . Availalble directions are ["top","right","bottom","left"]';
        }else{
          options.from1 = options.from2;
          options.from2 = '';
        }
        options.from1 = options.from1.toLowerCase()
      }
      if(!options.from2){
        options.from2 = '';
      }
      else{
        options.from2 = options.from2.toLowerCase()
      }
    }
    getReadable(guessCode){
      var directions = {
        'T':'top',
        'B':'bottom',
        'L':'left',
        'R':'right',
        '-':''
      }

      var guess = ''

      guessCode.split('').forEach(function(e){
        guess+=' '+directions[e];
      });

      return guess;
    }
    getNextDirection(options){
      var copy = JSON.parse(JSON.stringify(this.original)); // deep-copy the original array
      //this.rotator.rotateClockwise(clockwise);

      if(options.type == 'opposite'){
        this.rotator.rotate180degree(copy);
      }
      else if(options.type == 'clock'){
        this.rotator.rotateCounterClockwise(copy);
      }
      else if(options.type == 'non-clock'){
        this.rotator.rotateClockwise(copy);
      }

      this.normalizeOpitons(options);

      try{
        //get from something containing 2 direction like 'top-left' 
        //a normalized shorter version. For ths instence, it is 'TL'
        // if it was only top, it would be 'T-'
        var direction = this.getDirectionCode(options.from1+':'+options.from2);

        // get a position [i][j] in the array matching the direction code
        var pos = this.getPosition(direction,this.original);
        
        var guessCode = copy[pos.i][pos.j];
        
        if(options.codeOnly){
          return guessCode;
        }else{
          return this.getReadable(guessCode);
        }
      }
      catch(e){}
    }
  }
  return new CardinalSwitcher();
}.call()
