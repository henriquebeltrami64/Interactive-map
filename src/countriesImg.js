const Continente = { 
  CentralEurope: "a", 
  MiddleAfrica:"",
  EasternEurope:"", 
  NorthernEurope:"", 
  SouthernAfrica:"", 
  NorthAmerica:"", 
  Micronesia:"", 
  SoutheastEurope:"", 
  NorthernAfrica:"", 
  Melanesia:"",
  WesternAfrica:"",
  AustraliaandNewZealand:"",
  EasternAsia:"", 
  Polynesia:"", 
  Caribbean:"", 
  SouthEasternAsia:"", 
  SouthernEurope:"", 
  CentralAmerica:"",
  CentralAsia:"", 
  SouthernAsia:"", 
  SouthAmerica:"rio.jpg",
  WesternEurope:"", 
  EasternAfrica:"", 
  WesternAsia:""
};



function getImgContinente(nome){
  let n = nome.replaceAll(' ', '');
  n = n.split(",")[0];
  return Continente[n];
}