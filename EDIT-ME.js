/*
  ============================================================
  EDIT THIS FILE TO CUSTOMIZE YOUR STORE
  ============================================================
  Text must stay inside quotes. Put a comma after every product
  except the last one. Save the file, then refresh index.html.
*/

const STORE = {
  // Your business name and the email that receives completed orders
  name: "HEROIC",
  orderEmail: "Heroic@tuta.com",

  // Use USD, EUR, GBP, CAD, AUD, etc.
  currency: "USD",

  // Order discounts based on subtotal. Discounts apply ABOVE each dollar amount.
  orderDiscounts: [
    { minimumSubtotal: 500, percentOff: 10 },
    { minimumSubtotal: 1000, percentOff: 20 }
  ],

  // Copy a product block to add another product. Every id must be unique.
  products: [
    { id: "TC250-01", name: "Test C 250", category: "Injectables", batch: "BATCH 1", price: 30 },
    { id: "TE250-01", name: "Test E 250", category: "Injectables", batch: "BATCH 1", price: 30 },
    { id: "DE200-01", name: "Mast E 200", category: "Injectables", batch: "BATCH 1", price: 85 },
    { id: "DE400-01", name: "Mast E 400", category: "Injectables", batch: "BATCH 1", price: 160 },
    { id: "NPP200-01", name: "NPP 200", category: "Injectables", batch: "BATCH 1", price: 50 },
    { id: "TNE100-01", name: "TNE 200", category: "Injectables", batch: "BATCH 1", price: 30 },
    { id: "TRA-01", name: "Tren A 100", category: "Injectables", batch: "BATCH 1", price: 45 },
    { id: "VAR25-01", name: "Anavar 25", category: "Orals", batch: "BATCH 1", price: 90 },
    { id: "VAR25-01", name: "Anavar 10", category: "Orals", batch: "BATCH 1", price: 45 },
    { id: "DIA50-01", name: "Dianabol 50", category: "Orals", batch: "BATCH 1", price: 55 },
    { id: "OXY50-01", name: "Anadrol 50", category: "Orals", batch: "BATCH 1", price: 55 },
    { id: "DHB100-01", name: "DHB 100", category: "Injectables", batch: "BATCH 1", price: 55 }
  ]
};
