import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  data = { head: { vars: [] }, results: { bindings: [] } }
  parking: string[] = ["Adjacent public car", "Adjacent to public &", "Car park in Cappagh", "On street parking", "Parking along public", "Parking along the pu", "Public car park on C", "Within estate"];
  pitches: string[] = ["5-a-side Soccer Pitches", "All Weather Pitch", "All weather pitch", "All weather soccer pitch", "G.A.A. Pitch", "Rugby Pitch", "Soccer Pitch"];
  surfaces: string[] = ["Concrete", "Rubber Wet-pour surface", "Tarmac", "Wood Bark Surface", "Wood Bark and Grass turf surface"];
  playgrounds: string[] = ["An Sean Bhaile Playground 1", "An Sean Bhaile Playground 2", "Ballinfoyle Park Multi Use Games", "Ballinfoyle Park Playground", "Cappagh Park Playground", "Claude Toft Park Playground", "Coole Park Playground", "Fr Burke Park Playground", "Gleann Bhan Playground", "Henry Street Playground", "Kennedy Park Playground", "Lakeshore Drive Playground", "Lough Atalia Playground", "McGrath's Field Playground", "Merlin Park Adventure Playground", "Merlin Park Toddler Area", "Merlin Woods Park Playground", "Mervue Public Park Playground", "Millennium Children's Park", "Millennium Children's Park Skate Park", "Na Blatha Creige", "Roscam Park Playground 1", "Roscam Park Playground 2", "Sliding Rock Park Multi Use Games", "Sliding Rock Park Playground", "Slí Burca Playground", "South Park Playground", "Westside Park Playground", "Westside Park Skate Park"];
  sportsfacilities: string[] = ["Bohermore", "Cappagh Park", "Castlepark", "Corrib Park", "Crestwood", "Doughiska", "Fahy's Field", "Glen Oakes 1", "Jesuit's Field", "Laurel Park", "McGrath's Field", "Mervue", "Millars Lane 1", "Millars Lane 2", "O'Sullivan Park", "Renmore Park", "Roscam", "Shantalla", "South Park", "South Park, Mutton Island", "The Plots", "Westpark", "Westside Sports"];
  equipments: string[] = ["Basketball Hoops"];
  toiletfacilities: string[] = ["No", "Yes", "Yes- At adjacent Kno"];
  specialneeds: string[] = ["No", "Yes", " ",]
  selectedPlayground: string = "";
  selectedSurface: string = "";
  selectedSportsfacilities: string = "";
  selectedToiletfacilities: string = "";
  selectedParking: string = "";
  selectedPitch: string = "";
  selectedEquipment: string = "";
  selectedSpecialneeds: string = "";
  isQueryExecuted: boolean = false;
  objectKeys = Object.keys;

  questions = [
    {
      id: 1,
      question: "",
      dropdownValues: this.pitches
    },
    {}

  ];

  constructor() {
  }

  async query1clicked() {

    var query1 = `PREFIX math:<http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT  DISTINCT ?location (SUM(DISTINCT ?sumOfSpaces) AS ?number)
  where{
        ?coord a gc:BlueBadgeParking.
        ?coord gc:hasCoordinates ?coordinates.
       ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long.
        ?latlon gc:latitude ?lat.
      ?coord gc:description ?location.
        ?coord gc:noOfSpaces ?spaces
    BIND(xsd:integer(?spaces) AS ?sumOfSpaces)
    { SELECT ?long1 ?lat1 
        where {
        ?name a gc:Playground.
        ?name gc:name "`+ this.selectedPlayground + `".
        ?name gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long1.
        ?latlon gc:latitude ?lat1.
      }\
    }\
        BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
        BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
        BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
        BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
        BIND((6373 *11 * ?c) AS ?d)
    FILTER(?d < 2000)
  }
  GROUP BY ?location`

    var encodedQuery1 = "query=" + encodeURIComponent(query1);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery1, "method": "POST", "mode": "cors" }).then(res => res.json());
    this.isQueryExecuted = true;
  }

  async query2clicked() {
    var query2 = `PREFIX math:<http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
  SELECT  DISTINCT ?location ?name
  where{
      ?coord a gc:BlueBadgeParking.
        ?coord gc:hasCoordinates ?coordinates.
       ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long.
        ?latlon gc:latitude ?lat.
        ?coord gc:location ?location
    
    { SELECT ?long1 ?lat1 ?name
        where {
        ?main a gc:Playground.
        ?main gc:hasPlaygroundSurface ?surface.
        ?surface rdfs:label "`+ this.selectedSurface + `".
        ?main gc:name ?name.
        ?main gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long1.
        ?latlon gc:latitude ?lat1.
      }
    }
        BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
        BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
        BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
        BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
        BIND((6373 *11 * ?c) AS ?d)
    FILTER(?d < 2000)
  
  }
  `
    var encodedQuery2 = "query=" + encodeURIComponent(query2);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery2, "method": "POST", "mode": "cors" }).then(res => res.json());
    this.isQueryExecuted = true;
    console.log(this.data);
  }

  async query3clicked() {
    var query3 = `PREFIX math:<http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
  SELECT    DISTINCT ?location (SUM(DISTINCT ?sumOfSpaces) AS ?number)
  where{
       ?coord a gc:BlueBadgeParking.
        ?coord gc:hasCoordinates ?coordinates.
       ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long.
        ?latlon gc:latitude ?lat.
      ?coord gc:description ?location.
        ?coord gc:noOfSpaces ?spaces
    
    BIND(xsd:integer(?spaces) AS ?sumOfSpaces)
    
    { SELECT ?long1 ?lat1 
        where {
        ?name a gc:SportsFacility.
        ?name gc:name "`+ this.selectedSportsfacilities + `".
        ?name gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long1.
        ?latlon gc:latitude ?lat1.
      }
    }
        BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
        BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
        BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
        BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
        BIND((6373 *11 * ?c) AS ?d)
    FILTER(?d < 2000)
  }
  GROUP BY ?location 
  `

    var encodedQuery3 = "query=" + encodeURIComponent(query3);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery3, "method": "POST", "mode": "cors" }).then(res => res.json());
    this.isQueryExecuted = true;
  }

  async query4clicked() {
    var query4 = `PREFIX math:<http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
  SELECT  DISTINCT ?typeOfPitch 
  where{
        ?main a gc:SportsFacility.
      ?main gc:hasPitchType ?type.
        ?type rdfs:label ?typeOfPitch.
        ?main gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long.
        ?latlon gc:latitude ?lat.
    
    { SELECT ?long1 ?lat1 
        where {
          ?name a gc:Playground.
          ?name gc:name "`+ this.selectedPlayground + `".
        ?name gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long1.
        ?latlon gc:latitude ?lat1.
  
      }
    }
        BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
        BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
        BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
        BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
        BIND((6373 *11 * ?c) AS ?d)
     FILTER(?d < 2000 && regex(?typeOfPitch,"Pitch") || regex(?typeOfPitch,"pitch"))
  }
  `

    var encodedQuery4 = "query=" + encodeURIComponent(query4);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery4, "method": "POST", "mode": "cors" }).then(res => res.json());
    console.log(this.data);
    this.isQueryExecuted = true;
  }
  async query5clicked() {
    var query5 = `PREFIX math:<http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
  
  SELECT  DISTINCT ?name 
  where{
     ?main a gc:SportsFacility.
      ?main gc:hasPitchType ?type.
        ?type rdfs:label "`+ this.selectedPitch + `".
        ?main gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long.
        ?latlon gc:latitude ?lat.
    
    { SELECT ?long1 ?lat1 ?name
        where {
        ?main a gc:Playground.
        ?main gc:hasPlaygroundParking ?surface.
        ?surface rdfs:label "`+ this.selectedParking + `".
        ?main gc:name ?name.
        ?main gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long1.
        ?latlon gc:latitude ?lat1.
  
      }
    }
        BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
        BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
        BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
        BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
        BIND((6373 *11 * ?c) AS ?d)
    FILTER(?d < 1000)
  }
  `

    var encodedQuery5 = "query=" + encodeURIComponent(query5);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery5, "method": "POST", "mode": "cors" }).then(res => res.json());
    console.log(this.data);
    this.isQueryExecuted = true;
  }
  async query6clicked() {
    var query6 = `PREFIX math:<http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
  SELECT DISTINCT ?nameBasket ?location
  where{
      ?main a gc:Playground.
       ?main gc:hasPlaygroundEquipment ?hoop.
      ?hoop rdfs:label "`+ this.selectedEquipment + `".
     ?main gc:hasCoordinates ?coordinates.
     ?coordinates gc:hasLatLongCoordinates ?latlon.
       ?latlon gc:longitude ?long.
       ?latlon gc:latitude ?lat.
      ?main gc:name ?nameBasket.
    
    { SELECT ?long1 ?lat1 ?location
        where {
        ?name a gc:BlueBadgeParking.
      ?name gc:hasCoordinates ?coordinates.
       ?coordinates gc:hasLatLongCoordinates ?latlon.
        ?latlon gc:longitude ?long1.
        ?latlon gc:latitude ?lat1.
        ?name gc:description ?location
      }
    }
        BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
        BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
        BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
        BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
        BIND((6373 *11 * ?c) AS ?d)
    FILTER(?d < 1000)
  }
  `

    var encodedQuery6 = "query=" + encodeURIComponent(query6);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery6, "method": "POST", "mode": "cors" }).then(res => res.json());
    // console.log(this.data);
    this.isQueryExecuted = true;
  }
  async query7clicked() {
    var query7 = `PREFIX math:<http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX play: <http://uriplay.org/spec/ontology/#>
  
  SELECT  DISTINCT ?nameBasket 
  where{
      ?main a gc:Playground.
       ?main gc:name ?nameBasket.
     ?coord gc:hasCoordinates ?coordinates.
     ?coordinates gc:hasLatLongCoordinates ?latlon.
      ?latlon gc:longitude ?long.
       ?latlon gc:latitude ?lat.
    
    { SELECT ?long1 ?lat1
        where {
              ?main a gc:SportsFacility.
             ?main gc:name ?"`+ this.selectedSportsfacilities + `".
           ?coord gc:hasCoordinates ?coordinates.
                ?coordinates gc:hasLatLongCoordinates ?latlon.
             ?latlon gc:longitude ?long1.
             ?latlon gc:latitude ?lat1.
      }
    }
        BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
        BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
        BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
        BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
        BIND((6373 *11 * ?c) AS ?d)
    FILTER(?d < 500)
  }
  `

    var encodedQuery7 = "query=" + encodeURIComponent(query7);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery7, "method": "POST", "mode": "cors" }).then(res => res.json());
    // console.log(this.data);
    this.isQueryExecuted = true;
  }

  async query8clicked() {
    var query8 = `PREFIX math: <http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
  SELECT DISTINCT ?type
  where{
      ?main a gc:SportsFacility.
      ?main gc:hasCoordinates ?coordinates.
      ?coordinates gc:hasLatLongCoordinates ?latlon.
      ?latlon gc:longitude ?long.
      ?latlon gc:latitude ?lat.
      ?main gc:hasPitchType ?type_r.
      ?type_r rdfs:label ?type
  
    { SELECT ?long1 ?lat1 ?playground_name
        where {
          ?name a gc:Playground.
          ?name gc:toiletFacility "`+ this.selectedToiletfacilities + `".
          ?name gc:name ?playground_name.
           ?name gc:hasCoordinates ?coordinates.
          ?coordinates gc:hasLatLongCoordinates ?LatLong.
          ?LatLong gc:longitude ?long1.
          ?LatLong gc:latitude ?lat1.
        }
    }
    BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
    BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
    BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
    BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
    BIND((6373 *11 * ?c) AS ?d)
    FILTER(?d < 2000)
  }
  `

    var encodedQuery8 = "query=" + encodeURIComponent(query8);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery8, "method": "POST", "mode": "cors" }).then(res => res.json());
    this.isQueryExecuted = true;
  }

  async query9clicked() {
    var query9 = `PREFIX math: <http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  
  SELECT  DISTINCT ?location
  where{
      ?name a gc:BlueBadgeParking.
     ?name gc:hasCoordinates ?coordinates.
       ?coordinates gc:hasLatLongCoordinates ?latlon.
       ?latlon gc:longitude ?long.
       ?latlon gc:latitude ?lat.
       ?name gc:description ?location.
   
      { SELECT ?long1 ?lat1
          where {
            ?main a gc:SportsFacility.
            ?main gc:name "`+ this.selectedSportsfacilities + `".
          ?main gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?LatLong.
        ?LatLong gc:longitude ?long1.
        ?LatLong gc:latitude ?lat1.
        }
      }
          BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
      BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
      BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
      BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
      BIND((6373 *11 * ?c) AS ?d)
      FILTER(?d < 2000)
  }
  `

    var encodedQuery9 = "query=" + encodeURIComponent(query9);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery9, "method": "POST", "mode": "cors" }).then(res => res.json());
    this.isQueryExecuted = true;
  }
  async query10clicked() {
    var query10 = `PREFIX math:<http://www.w3.org/2005/xpath-functions/math#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX gc:<http://www.semanticweb.org/galway-city/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX play: <http://uriplay.org/spec/ontology/#>
  
  SELECT  DISTINCT ?name
  where{
      ?main a gc:SportsFacility.
     ?main gc:hasCoordinates ?coordinates.
       ?coordinates gc:hasLatLongCoordinates ?latlon.
       ?latlon gc:longitude ?long.
       ?latlon gc:latitude ?lat.
       ?main gc:name ?name
   
      { SELECT ?long1 ?lat1 ?needs
          where {
          ?s a gc:Playground.
            ?s gc:specialNeedsEquipment "`+ this.selectedSpecialneeds + `".
          ?s gc:hasCoordinates ?coordinates.
        ?coordinates gc:hasLatLongCoordinates ?LatLong.
        ?LatLong gc:longitude ?long1.
        ?LatLong gc:latitude ?lat1.
        }
      }
          BIND(xsd:decimal(?long1) - xsd:decimal(?long) AS ?dlon)
      BIND(xsd:decimal(?lat1) - xsd:decimal(?lat) AS ?dlat)
      BIND(math:pow(math:sin(?dlat/2),2) + math:cos(xsd:decimal(?lat1)) * math:cos(xsd:decimal(?lat)) * math:pow(math:sin(?dlon/2),2) AS ?a)
      BIND(2 *  math:atan2(math:sqrt(?a),math:sqrt(1-?a)) AS ?c)
      BIND((6373 *11 * ?c) AS ?d)
      FILTER(?d < 2000)
  }
  `
    var encodedQuery10 = "query=" + encodeURIComponent(query10);
    this.data = await fetch("http://localhost:3030/dataset/sparql", { "credentials": "include", "headers": { "accept": "application/sparql-results+json,*/*;q=0.9", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "x-requested-with": "XMLHttpRequest" }, "referrer": "http://localhost:3030/dataset.html?tab=query&ds=/ds", "referrerPolicy": "no-referrer-when-downgrade", "body": encodedQuery10, "method": "POST", "mode": "cors" }).then(res => res.json());
    this.isQueryExecuted = true;
  }

}
