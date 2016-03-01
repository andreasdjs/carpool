var expect = require('chai').expect;
//var myFunction = require('../modules/modules').myFunction;
var readModel = require('../modules/testModule').readModel;
var myFunction = require('../modules/testModule').myFunction;
// var getInfoLang = require('./async').getInfoLang;
var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);


describe('Test of read JSON-file.', function() {

// Test callback function


	it('returns language', function(done) {
		var ghLang = {
			'language': 'GUGGE'
		};
		var stub = sinon.stub().callsArgWith(0, ghLang);

		getInfoLang(stub, function(reply) {
			expect(reply).to.equal('Language is GUGGE');
			done();
		});
	});


});


describe('Get info from .JSON-file on GitHub.', function() {
	it('Empty test.', function(done) {
		console.log("output: " + myFunction(0));
		expect(myFunction(0)).is.a('number');
		done();
	});

/*
	it('returns information from GitHub', function(done) {
		getInfo(function(reply) {
			expect(reply.language).to.equal('JavaScript');
			expect(reply.owner.login).to.equal('xedric');
			done();
		});
	});*/
});

describe('Test of callback function.', function() {

// Test callback function

/*
	it('returns language', function(done) {
		var ghLang = {
			'language': 'GUGGE'
		};
		var stub = sinon.stub().callsArgWith(0, ghLang);

		getInfoLang(stub, function(reply) {
			expect(reply).to.equal('Language is GUGGE');
			done();
		});
	});
*/

});