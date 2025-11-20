from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

# Ruta al CSV
CSV_PATH = os.path.join("data", "electronica_retail_cl_simulada_4000.csv")

app = Flask(__name__)
CORS(app)

# ---------- CARGA DE DATOS ----------
def load_data(path):
    df = pd.read_csv(path)

    df = df.rename(columns={
        "product_name": "Description",
        "price_clp": "UnitPrice",
        "store_name": "Store",
        "category": "Category",
        "sku": "StockCode",
        "rating": "Rating"
    })

    df = df[["id", "Description", "Category", "UnitPrice", "Store", "Rating", "StockCode"]]
    return df

try:
    DATA = load_data(CSV_PATH)
    LOAD_ERROR = None
except Exception as e:
    DATA = pd.DataFrame()
    LOAD_ERROR = str(e)

# ---------- ENDPOINT: HOME ----------
@app.route("/", methods=["GET"])
def home():
    if LOAD_ERROR:
        return jsonify({"ok": False, "error": LOAD_ERROR})
    return jsonify({
        "ok": True,
        "message": "API funcionando correctamente",
        "total_products": len(DATA)
    })

# ---------- ENDPOINT: PRODUCTOS CON FILTROS ----------
@app.route("/products", methods=["GET"])
def get_products():
    df = DATA.copy()

    # "name" lo usaremos como búsqueda general (nombre o categoría)
    search   = request.args.get("name", "").strip().lower()
    store    = request.args.get("store", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")

    # 1) Filtro por búsqueda general (Description O Category)
    if search:
        mask = (
            df["Description"].str.lower().str.contains(search, na=False) |
            df["Category"].str.lower().str.contains(search, na=False)
        )
        df = df[mask]

    # 2) Filtros adicionales (se aplican como AND)
    if store:
        df = df[df["Store"].str.lower().str.contains(store, na=False)]

    if category:
        df = df[df["Category"].str.lower().str.contains(category, na=False)]

    if min_price:
        df = df[df["UnitPrice"] >= float(min_price)]

    if max_price:
        df = df[df["UnitPrice"] <= float(max_price)]

    return jsonify({
        "ok": True,
        "total": len(df),
        "items": df.to_dict(orient="records")
    })

# ---------- ENDPOINT: MEJOR PRECIO POR PRODUCTO ----------
@app.route("/best_price", methods=["GET"])
def best_price():
    df = DATA.copy()
    best = df.loc[df.groupby("Description")["UnitPrice"].idxmin()].sort_values("UnitPrice")
    return jsonify({"ok": True, "items": best.to_dict(orient="records")})

# ---------- ENDPOINT: MÉTRICAS DE PRECIO ----------
@app.route("/summary", methods=["GET"])
def summary():
    df = DATA.copy()
    return jsonify({
        "ok": True,
        "num_products": len(df),
        "avg_price": round(df["UnitPrice"].mean(), 2),
        "min_price": float(df["UnitPrice"].min()),
        "max_price": float(df["UnitPrice"].max()),
        "cheapest_product": df.loc[df["UnitPrice"].idxmin()].to_dict(),
        "most_expensive_product": df.loc[df["UnitPrice"].idxmax()].to_dict()
    })

# ---------- ENDPOINT: RELACIÓN PRECIO / CALIDAD ----------
@app.route("/price_quality", methods=["GET"])
def price_vs_quality():
    df = DATA.copy()
    df = df[df["Rating"] > 0]  # evitar divisiones por 0
    df["PriceQuality"] = df["UnitPrice"] / df["Rating"]
    ranked = df.sort_values("PriceQuality").head(10)
    return jsonify({"ok": True, "items": ranked.to_dict(orient="records")})
# ---------- ENDPOINT: MEJOR OFERTA POR PRODUCTO (calidad/precio) ----------
@app.route("/best_deal", methods=["GET"])
def best_deal():
    product_name = request.args.get("name", "").strip().lower()

    if not product_name:
        return jsonify({"ok": False, "error": "Debe proporcionar un parámetro ?name=producto"}), 400

    df = DATA.copy()

    # Filtrar productos que contengan ese nombre en Description
    matches = df[df["Description"].str.lower().str.contains(product_name)]

    if matches.empty:
        return jsonify({"ok": False, "error": "Producto no encontrado"}), 404

    # Calcular relación precio/calidad solo si tiene rating válido (> 0)
    matches = matches[matches["Rating"] > 0]
    matches["PriceQuality"] = matches["UnitPrice"] / matches["Rating"]

    # Ordenar de mejor a peor (menor precio/calidad es mejor)
    best_option = matches.sort_values("PriceQuality").iloc[0]

    return jsonify({
        "ok": True,
        "product_name": best_option["Description"],
        "best_store": best_option["Store"],
        "price": float(best_option["UnitPrice"]),
        "rating": float(best_option["Rating"]),
        "price_quality_score": round(float(best_option["PriceQuality"]), 3)
    })


# ---------- EJECUCIÓN ----------
if __name__ == "__main__":
    app.run(debug=True)
