# -*- coding: utf-8 -*-
"""
Generador del libro de Excel contable para monky's.

Crea un archivo .xlsx con:
  - Instrucciones
  - Plan de Cuentas (base PCGE)
  - Libro Diario (fuente única de la información)
  - Registro de Ventas (IGV 18%)
  - Registro de Compras (IGV 18%)
  - Balance de Comprobación (automático)
  - Estado de Resultados (automático)
  - Estado de Situación Financiera (automático)

Los estados financieros se calculan solos a partir del Libro Diario.
"""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, NamedStyle
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

# ---------------------------------------------------------------------------
# Estilos y paleta
# ---------------------------------------------------------------------------
AZUL = "1F4E78"          # cabeceras principales
AZUL_CLARO = "DDEBF7"    # subtotales / franjas
GRIS = "F2F2F2"          # franjas alternas
VERDE = "548235"
ROJO = "C00000"
DORADO = "BF8F00"
BLANCO = "FFFFFF"

NUM_SOLES = '#,##0.00;[Red]-#,##0.00'
FECHA_FMT = 'DD/MM/YYYY'

thin = Side(style="thin", color="BFBFBF")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

# Cuántas filas de captura de datos reservamos (rango de las fórmulas)
N_DIARIO = 2000     # filas de Libro Diario
N_VENTAS = 1000
N_COMPRAS = 1000


def header_fill(color=AZUL):
    return PatternFill("solid", fgColor=color)


def estilo_titulo(ws, celda, texto, size=16, color=AZUL):
    ws[celda] = texto
    ws[celda].font = Font(bold=True, size=size, color=color)


def estilo_cabecera_fila(ws, fila, n_cols, color=AZUL, start_col=1):
    for c in range(start_col, start_col + n_cols):
        cell = ws.cell(row=fila, column=c)
        cell.font = Font(bold=True, color=BLANCO, size=11)
        cell.fill = header_fill(color)
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER


# ===========================================================================
# Plan de cuentas (base PCGE, simplificado para retail)
# Cada cuenta lleva: Tipo y Rubro (para armar los EE.FF.)
# Tipo: ACTIVO / PASIVO / PATRIMONIO / INGRESO / GASTO / COSTO
# ===========================================================================
PLAN = [
    # Codigo, Nombre, Tipo, Rubro EE.FF.
    ("10",   "Efectivo y equivalentes de efectivo", "ACTIVO", "Activo Corriente"),
    ("101",  "Caja",                                 "ACTIVO", "Activo Corriente"),
    ("104",  "Cuentas corrientes bancarias",         "ACTIVO", "Activo Corriente"),
    ("105",  "Yape / Plin / billeteras digitales",   "ACTIVO", "Activo Corriente"),
    ("12",   "Cuentas por cobrar comerciales",       "ACTIVO", "Activo Corriente"),
    ("121",  "Facturas y boletas por cobrar",        "ACTIVO", "Activo Corriente"),
    ("16",   "Cuentas por cobrar diversas",          "ACTIVO", "Activo Corriente"),
    ("20",   "Mercaderías (existencias)",            "ACTIVO", "Activo Corriente"),
    ("201",  "Mercaderías - ropa",                   "ACTIVO", "Activo Corriente"),
    ("40111","IGV - crédito fiscal (compras)",       "ACTIVO", "Activo Corriente"),
    ("33",   "Inmuebles, maquinaria y equipo",       "ACTIVO", "Activo No Corriente"),
    ("335",  "Muebles y enseres",                    "ACTIVO", "Activo No Corriente"),
    ("336",  "Equipos diversos / cómputo",           "ACTIVO", "Activo No Corriente"),
    ("39",   "Depreciación acumulada",               "ACTIVO", "Activo No Corriente"),

    ("40",   "Tributos por pagar",                   "PASIVO", "Pasivo Corriente"),
    ("40112","IGV - débito fiscal (ventas)",         "PASIVO", "Pasivo Corriente"),
    ("4017", "Impuesto a la renta por pagar",        "PASIVO", "Pasivo Corriente"),
    ("403",  "ESSALUD / ONP / contribuciones",       "PASIVO", "Pasivo Corriente"),
    ("42",   "Cuentas por pagar comerciales",        "PASIVO", "Pasivo Corriente"),
    ("421",  "Facturas de proveedores por pagar",    "PASIVO", "Pasivo Corriente"),
    ("41",   "Remuneraciones por pagar",             "PASIVO", "Pasivo Corriente"),
    ("45",   "Obligaciones financieras (préstamos)", "PASIVO", "Pasivo No Corriente"),

    ("50",   "Capital",                              "PATRIMONIO", "Patrimonio"),
    ("501",  "Capital social",                       "PATRIMONIO", "Patrimonio"),
    ("58",   "Reservas",                             "PATRIMONIO", "Patrimonio"),
    ("59",   "Resultados acumulados",                "PATRIMONIO", "Patrimonio"),

    ("70",   "Ventas",                               "INGRESO", "Ventas"),
    ("701",  "Mercaderías - ventas",                 "INGRESO", "Ventas"),
    ("75",   "Otros ingresos de gestión",            "INGRESO", "Otros Ingresos"),
    ("77",   "Ingresos financieros",                 "INGRESO", "Otros Ingresos"),

    ("69",   "Costo de ventas",                      "COSTO",  "Costo de Ventas"),
    ("691",  "Mercaderías - costo",                  "COSTO",  "Costo de Ventas"),

    ("60",   "Compras (mercaderías)",                "COSTO",  "Compras"),
    ("62",   "Gastos de personal",                   "GASTO",  "Gastos de Personal"),
    ("621",  "Sueldos y salarios",                   "GASTO",  "Gastos de Personal"),
    ("627",  "Seguridad y previsión social",         "GASTO",  "Gastos de Personal"),
    ("63",   "Servicios prestados por terceros",     "GASTO",  "Gastos de Servicios"),
    ("631",  "Transporte y fletes",                  "GASTO",  "Gastos de Servicios"),
    ("636",  "Servicios básicos (luz, agua, internet)","GASTO","Gastos de Servicios"),
    ("637",  "Publicidad y marketing",               "GASTO",  "Gastos de Servicios"),
    ("638",  "Comisiones (POS, pasarelas)",          "GASTO",  "Gastos de Servicios"),
    ("64",   "Gastos por tributos",                  "GASTO",  "Otros Gastos"),
    ("65",   "Otros gastos de gestión",              "GASTO",  "Otros Gastos"),
    ("656",  "Suministros / útiles",                 "GASTO",  "Otros Gastos"),
    ("659",  "Gastos diversos",                      "GASTO",  "Otros Gastos"),
    ("68",   "Depreciación del ejercicio",           "GASTO",  "Otros Gastos"),
    ("67",   "Gastos financieros (intereses)",       "GASTO",  "Gastos Financieros"),
    ("66",   "Pérdidas / gastos extraordinarios",    "GASTO",  "Otros Gastos"),
]


def construir():
    wb = Workbook()

    # -------------------------------------------------------------------
    # 1. INSTRUCCIONES
    # -------------------------------------------------------------------
    ws = wb.active
    ws.title = "Instrucciones"
    ws.sheet_view.showGridLines = False
    ws.column_dimensions["A"].width = 3
    ws.column_dimensions["B"].width = 110

    estilo_titulo(ws, "B2", "📘 LIBRO CONTABLE - monky's", size=20)
    ws["B3"] = "Contabilidad para microempresa (Perú · PCGE · IGV 18%)"
    ws["B3"].font = Font(italic=True, size=11, color="595959")

    lineas = [
        ("¿Cómo funciona este archivo?", True),
        ("Todo se registra UNA sola vez en el LIBRO DIARIO. Los demás reportes se calculan solos.", False),
        ("", False),
        ("Hojas del archivo:", True),
        ("1) Plan de Cuentas — catálogo de cuentas (puedes agregar más; respeta el formato).", False),
        ("2) Libro Diario — aquí registras cada operación con DEBE y HABER. Es la fuente de todo.", False),
        ("3) Registro de Ventas — libro tributario SUNAT de tus ventas (separa base + IGV).", False),
        ("4) Registro de Compras — libro tributario SUNAT de tus compras (separa base + IGV).", False),
        ("5) Balance de Comprobación — sumas y saldos por cuenta (AUTOMÁTICO).", False),
        ("6) Estado de Resultados — ganancias y pérdidas del periodo (AUTOMÁTICO).", False),
        ("7) Estado de Situación Financiera — el balance general: activo, pasivo, patrimonio (AUTOMÁTICO).", False),
        ("", False),
        ("Pasos para empezar:", True),
        ("• Paso 1: revisa el Plan de Cuentas y ajusta nombres/cuentas a tu negocio.", False),
        ("• Paso 2: registra el asiento de apertura en el Libro Diario (caja, capital, mercadería inicial...).", False),
        ("• Paso 3: registra cada operación diaria en el Libro Diario. Usa el CÓDIGO de cuenta exacto.", False),
        ("• Paso 4: registra ventas y compras en sus hojas para el control de IGV (SUNAT).", False),
        ("• Paso 5: abre Balance / Estado de Resultados / Situación Financiera: ya están calculados.", False),
        ("", False),
        ("Reglas de oro de la partida doble:", True),
        ("• En cada asiento, la suma del DEBE debe ser igual a la suma del HABER.", False),
        ("• El Balance de Comprobación tiene un semáforo: si DEBE = HABER, sale ✔ CUADRA.", False),
        ("• El Estado de Situación Financiera verifica que ACTIVO = PASIVO + PATRIMONIO.", False),
        ("", False),
        ("IGV (18%):", True),
        ("• Venta: Total = Base × 1.18.  IGV = Base × 0.18 (cuenta 40112, lo debes a SUNAT).", False),
        ("• Compra: el IGV (cuenta 40111) es tu crédito fiscal y se descuenta del IGV de ventas.", False),
        ("• IGV a pagar del mes = IGV ventas (40112) − IGV compras (40111).", False),
        ("", False),
        ("Consejo: NO borres filas ni cambies los títulos de columnas; las fórmulas dependen de ellos.", True),
    ]
    r = 5
    for texto, es_titulo in lineas:
        c = ws.cell(row=r, column=2, value=texto)
        if es_titulo:
            c.font = Font(bold=True, size=12, color=AZUL)
        else:
            c.font = Font(size=11, color="333333")
            c.alignment = Alignment(wrap_text=True)
        r += 1

    # -------------------------------------------------------------------
    # 2. PLAN DE CUENTAS
    # -------------------------------------------------------------------
    wsp = wb.create_sheet("Plan de Cuentas")
    wsp.sheet_view.showGridLines = False
    estilo_titulo(wsp, "A1", "PLAN DE CUENTAS (base PCGE)")
    cab = ["Código", "Denominación de la cuenta", "Tipo", "Rubro EE.FF."]
    for i, t in enumerate(cab, start=1):
        wsp.cell(row=3, column=i, value=t)
    estilo_cabecera_fila(wsp, 3, len(cab))

    for j, (cod, nom, tipo, rubro) in enumerate(PLAN):
        fila = 4 + j
        wsp.cell(row=fila, column=1, value=cod)
        wsp.cell(row=fila, column=2, value=nom)
        wsp.cell(row=fila, column=3, value=tipo)
        wsp.cell(row=fila, column=4, value=rubro)
        fillc = GRIS if j % 2 else BLANCO
        for c in range(1, 5):
            cell = wsp.cell(row=fila, column=c)
            cell.fill = header_fill(fillc)
            cell.border = BORDER
            cell.alignment = Alignment(vertical="center")
        wsp.cell(row=fila, column=1).alignment = Alignment(horizontal="center")
    ultima_plan = 4 + len(PLAN) - 1

    wsp.column_dimensions["A"].width = 12
    wsp.column_dimensions["B"].width = 45
    wsp.column_dimensions["C"].width = 14
    wsp.column_dimensions["D"].width = 22
    wsp.freeze_panes = "A4"
    wsp.auto_filter.ref = f"A3:D{ultima_plan}"

    # Nombre de rango para validaciones (lista de códigos)
    rango_codigos = f"'Plan de Cuentas'!$A$4:$A${ultima_plan}"

    # -------------------------------------------------------------------
    # 3. LIBRO DIARIO  (fuente única)
    # -------------------------------------------------------------------
    wsd = wb.create_sheet("Libro Diario")
    wsd.sheet_view.showGridLines = False
    estilo_titulo(wsd, "A1", "LIBRO DIARIO")
    wsd["A2"] = "Registra aquí cada operación. La suma del DEBE de cada asiento debe igualar la del HABER."
    wsd["A2"].font = Font(italic=True, color="595959", size=10)

    cab_d = ["Fecha", "N° Asiento", "Código\nCuenta", "Denominación (automática)",
             "Glosa / Detalle", "Debe", "Haber"]
    for i, t in enumerate(cab_d, start=1):
        wsd.cell(row=3, column=i, value=t)
    estilo_cabecera_fila(wsd, 3, len(cab_d))

    anchos_d = [13, 11, 12, 38, 40, 14, 14]
    for i, w in enumerate(anchos_d, start=1):
        wsd.column_dimensions[get_column_letter(i)].width = w

    fila_ini, fila_fin = 4, 4 + N_DIARIO - 1
    for f in range(fila_ini, fila_fin + 1):
        # Denominación automática: busca el código en el Plan de Cuentas
        wsd.cell(row=f, column=4,
                 value=f'=IFERROR(IF($C{f}="","",VLOOKUP($C{f},'
                       f"'Plan de Cuentas'!$A$4:$B${ultima_plan},2,FALSE)),"
                       f'"⚠ código no existe")')
        wsd.cell(row=f, column=1).number_format = FECHA_FMT
        wsd.cell(row=f, column=6).number_format = NUM_SOLES
        wsd.cell(row=f, column=7).number_format = NUM_SOLES
        fillc = GRIS if (f - fila_ini) % 2 else BLANCO
        for c in range(1, 8):
            cell = wsd.cell(row=f, column=c)
            cell.border = BORDER
            if c not in (4,):  # denominación con su propio color
                cell.fill = header_fill(fillc)
        wsd.cell(row=f, column=4).fill = header_fill(AZUL_CLARO)
        wsd.cell(row=f, column=4).font = Font(italic=True, color="444444")

    # Fila de totales
    ftot = fila_fin + 1
    wsd.cell(row=ftot, column=5, value="TOTALES")
    wsd.cell(row=ftot, column=6, value=f"=SUM(F{fila_ini}:F{fila_fin})")
    wsd.cell(row=ftot, column=7, value=f"=SUM(G{fila_ini}:G{fila_fin})")
    for c in (5, 6, 7):
        cell = wsd.cell(row=ftot, column=c)
        cell.font = Font(bold=True, color=BLANCO)
        cell.fill = header_fill(AZUL)
        cell.border = BORDER
    wsd.cell(row=ftot, column=6).number_format = NUM_SOLES
    wsd.cell(row=ftot, column=7).number_format = NUM_SOLES
    # Verificación de cuadre
    wsd.cell(row=ftot, column=8,
             value=f'=IF(ROUND(F{ftot}-G{ftot},2)=0,"✔ CUADRA","✗ DESCUADRE")')
    wsd.cell(row=ftot, column=8).font = Font(bold=True, color=VERDE)

    wsd.freeze_panes = "A4"

    # Validación de datos: dropdown con códigos de cuenta
    dv = DataValidation(type="list", formula1=f"={rango_codigos}", allow_blank=True)
    dv.error = "Usa un código que exista en el Plan de Cuentas."
    dv.errorTitle = "Código inválido"
    dv.prompt = "Elige el código de la cuenta"
    wsd.add_data_validation(dv)
    dv.add(f"C{fila_ini}:C{fila_fin}")

    # Asiento de ejemplo (apertura) - filas 4 a 6
    ejemplos = [
        ("2026-01-01", 1, "101", "Apertura: aporte de capital en caja", 5000, None),
        ("2026-01-01", 1, "201", "Apertura: mercadería inicial", 8000, None),
        ("2026-01-01", 1, "501", "Apertura: capital social aportado", None, 13000),
    ]
    for k, (fecha, nro, cod, glosa, debe, haber) in enumerate(ejemplos):
        f = fila_ini + k
        wsd.cell(row=f, column=1, value=fecha).number_format = FECHA_FMT
        wsd.cell(row=f, column=2, value=nro)
        wsd.cell(row=f, column=3, value=cod)
        wsd.cell(row=f, column=5, value=glosa)
        if debe is not None:
            wsd.cell(row=f, column=6, value=debe)
        if haber is not None:
            wsd.cell(row=f, column=7, value=haber)

    # -------------------------------------------------------------------
    # 4. REGISTRO DE VENTAS
    # -------------------------------------------------------------------
    wsv = wb.create_sheet("Registro de Ventas")
    wsv.sheet_view.showGridLines = False
    estilo_titulo(wsv, "A1", "REGISTRO DE VENTAS (IGV 18%)")
    cab_v = ["Fecha", "Tipo Comp.", "Serie-Número", "RUC/DNI Cliente",
             "Cliente", "Base Imponible", "IGV (18%)", "Total"]
    for i, t in enumerate(cab_v, start=1):
        wsv.cell(row=3, column=i, value=t)
    estilo_cabecera_fila(wsv, 3, len(cab_v))
    anchos_v = [13, 12, 16, 16, 30, 16, 14, 16]
    for i, w in enumerate(anchos_v, start=1):
        wsv.column_dimensions[get_column_letter(i)].width = w

    vi, vf = 4, 4 + N_VENTAS - 1
    for f in range(vi, vf + 1):
        # IGV y Total automáticos a partir de la base
        wsv.cell(row=f, column=7, value=f'=IF($F{f}="","",ROUND($F{f}*0.18,2))')
        wsv.cell(row=f, column=8, value=f'=IF($F{f}="","",$F{f}+$G{f})')
        for c, fmt in ((6, NUM_SOLES), (7, NUM_SOLES), (8, NUM_SOLES)):
            wsv.cell(row=f, column=c).number_format = fmt
        wsv.cell(row=f, column=1).number_format = FECHA_FMT
        fillc = GRIS if (f - vi) % 2 else BLANCO
        for c in range(1, 9):
            wsv.cell(row=f, column=c).border = BORDER
            wsv.cell(row=f, column=c).fill = header_fill(fillc)
    vt = vf + 1
    wsv.cell(row=vt, column=5, value="TOTALES")
    for c, col in ((6, "F"), (7, "G"), (8, "H")):
        wsv.cell(row=vt, column=c, value=f"=SUM({col}{vi}:{col}{vf})")
        wsv.cell(row=vt, column=c).number_format = NUM_SOLES
    for c in range(5, 9):
        wsv.cell(row=vt, column=c).font = Font(bold=True, color=BLANCO)
        wsv.cell(row=vt, column=c).fill = header_fill(VERDE)
        wsv.cell(row=vt, column=c).border = BORDER
    wsv.freeze_panes = "A4"
    # Dropdown tipo de comprobante
    dvt = DataValidation(type="list", formula1='"Factura,Boleta,Nota Crédito,Nota Débito"', allow_blank=True)
    wsv.add_data_validation(dvt)
    dvt.add(f"B{vi}:B{vf}")
    # ejemplo
    wsv.cell(row=vi, column=1, value="2026-01-05").number_format = FECHA_FMT
    wsv.cell(row=vi, column=2, value="Boleta")
    wsv.cell(row=vi, column=3, value="B001-000001")
    wsv.cell(row=vi, column=5, value="Cliente mostrador")
    wsv.cell(row=vi, column=6, value=100)

    # -------------------------------------------------------------------
    # 5. REGISTRO DE COMPRAS
    # -------------------------------------------------------------------
    wsc = wb.create_sheet("Registro de Compras")
    wsc.sheet_view.showGridLines = False
    estilo_titulo(wsc, "A1", "REGISTRO DE COMPRAS (IGV 18%)")
    cab_c = ["Fecha", "Tipo Comp.", "Serie-Número", "RUC Proveedor",
             "Proveedor", "Base Imponible", "IGV (18%)", "Total"]
    for i, t in enumerate(cab_c, start=1):
        wsc.cell(row=3, column=i, value=t)
    estilo_cabecera_fila(wsc, 3, len(cab_c), color=DORADO)
    for i, w in enumerate(anchos_v, start=1):
        wsc.column_dimensions[get_column_letter(i)].width = w

    ci, cf = 4, 4 + N_COMPRAS - 1
    for f in range(ci, cf + 1):
        wsc.cell(row=f, column=7, value=f'=IF($F{f}="","",ROUND($F{f}*0.18,2))')
        wsc.cell(row=f, column=8, value=f'=IF($F{f}="","",$F{f}+$G{f})')
        for c in (6, 7, 8):
            wsc.cell(row=f, column=c).number_format = NUM_SOLES
        wsc.cell(row=f, column=1).number_format = FECHA_FMT
        fillc = GRIS if (f - ci) % 2 else BLANCO
        for c in range(1, 9):
            wsc.cell(row=f, column=c).border = BORDER
            wsc.cell(row=f, column=c).fill = header_fill(fillc)
    ct = cf + 1
    wsc.cell(row=ct, column=5, value="TOTALES")
    for c, col in ((6, "F"), (7, "G"), (8, "H")):
        wsc.cell(row=ct, column=c, value=f"=SUM({col}{ci}:{col}{cf})")
        wsc.cell(row=ct, column=c).number_format = NUM_SOLES
    for c in range(5, 9):
        wsc.cell(row=ct, column=c).font = Font(bold=True, color=BLANCO)
        wsc.cell(row=ct, column=c).fill = header_fill(DORADO)
        wsc.cell(row=ct, column=c).border = BORDER
    wsc.freeze_panes = "A4"
    dvt2 = DataValidation(type="list", formula1='"Factura,Boleta,Nota Crédito,Nota Débito,Recibo H."', allow_blank=True)
    wsc.add_data_validation(dvt2)
    dvt2.add(f"B{ci}:B{cf}")
    wsc.cell(row=ci, column=1, value="2026-01-03").number_format = FECHA_FMT
    wsc.cell(row=ci, column=2, value="Factura")
    wsc.cell(row=ci, column=3, value="F001-000123")
    wsc.cell(row=ci, column=5, value="Proveedor textil SAC")
    wsc.cell(row=ci, column=6, value=500)

    # -------------------------------------------------------------------
    # 6. BALANCE DE COMPROBACIÓN  (automático desde Libro Diario)
    # -------------------------------------------------------------------
    wsb = wb.create_sheet("Balance Comprobación")
    wsb.sheet_view.showGridLines = False
    estilo_titulo(wsb, "A1", "BALANCE DE COMPROBACIÓN (automático)")
    cab_b = ["Código", "Denominación", "Tipo", "Sumas Debe", "Sumas Haber",
             "Saldo Deudor", "Saldo Acreedor"]
    for i, t in enumerate(cab_b, start=1):
        wsb.cell(row=3, column=i, value=t)
    estilo_cabecera_fila(wsb, 3, len(cab_b))
    anchos_b = [12, 42, 14, 15, 15, 15, 15]
    for i, w in enumerate(anchos_b, start=1):
        wsb.column_dimensions[get_column_letter(i)].width = w

    diario_cod = f"'Libro Diario'!$C${fila_ini}:$C${fila_fin}"
    diario_debe = f"'Libro Diario'!$F${fila_ini}:$F${fila_fin}"
    diario_haber = f"'Libro Diario'!$G${fila_ini}:$G${fila_fin}"

    bi = 4
    for j, (cod, nom, tipo, rubro) in enumerate(PLAN):
        f = bi + j
        wsb.cell(row=f, column=1, value=cod).alignment = Alignment(horizontal="center")
        wsb.cell(row=f, column=2, value=nom)
        wsb.cell(row=f, column=3, value=tipo)
        wsb.cell(row=f, column=4, value=f'=SUMIF({diario_cod},$A{f},{diario_debe})')
        wsb.cell(row=f, column=5, value=f'=SUMIF({diario_cod},$A{f},{diario_haber})')
        wsb.cell(row=f, column=6, value=f'=IF(D{f}-E{f}>0,D{f}-E{f},0)')
        wsb.cell(row=f, column=7, value=f'=IF(E{f}-D{f}>0,E{f}-D{f},0)')
        for c in range(4, 8):
            wsb.cell(row=f, column=c).number_format = NUM_SOLES
        fillc = GRIS if j % 2 else BLANCO
        for c in range(1, 8):
            wsb.cell(row=f, column=c).border = BORDER
            wsb.cell(row=f, column=c).fill = header_fill(fillc)
    bf = bi + len(PLAN) - 1
    bt = bf + 1
    wsb.cell(row=bt, column=2, value="TOTALES")
    for c, col in ((4, "D"), (5, "E"), (6, "F"), (7, "G")):
        wsb.cell(row=bt, column=c, value=f"=SUM({col}{bi}:{col}{bf})")
        wsb.cell(row=bt, column=c).number_format = NUM_SOLES
    for c in range(2, 8):
        wsb.cell(row=bt, column=c).font = Font(bold=True, color=BLANCO)
        wsb.cell(row=bt, column=c).fill = header_fill(AZUL)
        wsb.cell(row=bt, column=c).border = BORDER
    # semáforo de cuadre
    wsb.cell(row=bt + 1, column=2, value="Verificación:")
    wsb.cell(row=bt + 1, column=2).font = Font(bold=True)
    wsb.cell(row=bt + 1, column=3,
             value=f'=IF(AND(ROUND(D{bt}-E{bt},2)=0,ROUND(F{bt}-G{bt},2)=0),'
                   f'"✔ CUADRA","✗ DESCUADRE")')
    wsb.cell(row=bt + 1, column=3).font = Font(bold=True, color=VERDE, size=12)
    wsb.freeze_panes = "A4"

    # Helpers de rangos para EE.FF.
    bal_tipo = f"'Balance Comprobación'!$C${bi}:$C${bf}"
    bal_rubro_plan = f"'Plan de Cuentas'!$D$4:$D${ultima_plan}"
    bal_cod = f"'Balance Comprobación'!$A${bi}:$A${bf}"
    bal_deudor = f"'Balance Comprobación'!$F${bi}:$F${bf}"
    bal_acreedor = f"'Balance Comprobación'!$G${bi}:$G${bf}"
    bal_debe = f"'Balance Comprobación'!$D${bi}:$D${bf}"
    bal_haber = f"'Balance Comprobación'!$E${bi}:$E${bf}"

    # Para sumar por RUBRO necesitamos el rubro junto al balance.
    # Añadimos columna oculta H en el balance con el rubro (VLOOKUP al plan).
    for j in range(len(PLAN)):
        f = bi + j
        wsb.cell(row=f, column=8,
                 value=f"=IFERROR(VLOOKUP($A{f},'Plan de Cuentas'!$A$4:$D${ultima_plan},4,FALSE),\"\")")
    wsb.column_dimensions["H"].hidden = True
    bal_rubro = f"'Balance Comprobación'!$H${bi}:$H${bf}"

    # -------------------------------------------------------------------
    # 7. ESTADO DE RESULTADOS  (automático)
    # -------------------------------------------------------------------
    wsr = wb.create_sheet("Estado Resultados")
    wsr.sheet_view.showGridLines = False
    estilo_titulo(wsr, "A1", "ESTADO DE RESULTADOS (automático)")
    wsr["A2"] = "Periodo según lo registrado en el Libro Diario"
    wsr["A2"].font = Font(italic=True, color="595959", size=10)
    wsr.column_dimensions["A"].width = 6
    wsr.column_dimensions["B"].width = 45
    wsr.column_dimensions["C"].width = 18

    def sumif_rubro(rubro, sumcol):
        # suma saldos (deudor o acreedor) del balance filtrando por rubro
        return f'SUMIF({bal_rubro},"{rubro}",{sumcol})'

    # Cada fila: (clave_unica, etiqueta, formula_o_None, estilo)
    # estilo: "normal" | "subtotal" | "neta"
    R0 = 4  # primera fila de datos
    filas_er = [
        ("ventas",      "Ventas netas",
            f"=ROUND({sumif_rubro('Ventas', bal_acreedor)},2)", "normal"),
        ("otros_ing",   "Otros ingresos",
            f"=ROUND({sumif_rubro('Otros Ingresos', bal_acreedor)},2)", "normal"),
        ("costo",       "(-) Costo de ventas",
            f"=-ROUND({sumif_rubro('Costo de Ventas', bal_deudor)},2)", "normal"),
        ("u_bruta",     "UTILIDAD BRUTA", None, "subtotal"),
        ("g_personal",  "(-) Gastos de personal",
            f"=-ROUND({sumif_rubro('Gastos de Personal', bal_deudor)},2)", "normal"),
        ("g_servicios", "(-) Gastos de servicios",
            f"=-ROUND({sumif_rubro('Gastos de Servicios', bal_deudor)},2)", "normal"),
        ("g_otros",     "(-) Otros gastos",
            f"=-ROUND({sumif_rubro('Otros Gastos', bal_deudor)},2)", "normal"),
        ("u_oper",      "UTILIDAD OPERATIVA", None, "subtotal"),
        ("g_financ",    "(-) Gastos financieros",
            f"=-ROUND({sumif_rubro('Gastos Financieros', bal_deudor)},2)", "normal"),
        ("u_ai",        "UTILIDAD ANTES DE IMPUESTOS", None, "subtotal"),
        ("impuesto",    "(-) Impuesto a la renta (estimado)", None, "normal"),
        ("u_neta",      "UTILIDAD NETA DEL EJERCICIO", None, "neta"),
    ]
    # mapa clave -> fila
    fr = {clave: R0 + i for i, (clave, *_rest) in enumerate(filas_er)}

    # subtotales que se calculan con referencias a celdas (no SUMIF directo)
    formulas_subtotal = {
        "u_bruta": f"=C{fr['ventas']}+C{fr['otros_ing']}+C{fr['costo']}",
        "u_oper":  f"=C{fr['u_bruta']}+C{fr['g_personal']}+C{fr['g_servicios']}+C{fr['g_otros']}",
        "u_ai":    f"=C{fr['u_oper']}+C{fr['g_financ']}",
        # impuesto a la renta estimado 29.5% si hay utilidad (ajustable según régimen)
        "impuesto": f"=-IF(C{fr['u_ai']}>0,ROUND(C{fr['u_ai']}*0.295,2),0)",
        "u_neta":  f"=C{fr['u_ai']}+C{fr['impuesto']}",
    }

    for clave, etiqueta, formula, estilo in filas_er:
        rr = fr[clave]
        wsr.cell(row=rr, column=2, value=etiqueta)
        valor = formula if formula is not None else formulas_subtotal.get(clave)
        if valor is not None:
            wsr.cell(row=rr, column=3, value=valor)
        wsr.cell(row=rr, column=3).number_format = NUM_SOLES
        if estilo in ("subtotal", "neta"):
            for c in (2, 3):
                cell = wsr.cell(row=rr, column=c)
                cell.font = Font(bold=True, color=BLANCO if estilo == "neta" else AZUL)
                cell.fill = header_fill(VERDE if estilo == "neta" else AZUL_CLARO)
                cell.border = BORDER
        else:
            for c in (2, 3):
                wsr.cell(row=rr, column=c).border = BORDER
        wsr.cell(row=rr, column=3).number_format = NUM_SOLES

    r = R0 + len(filas_er)

    # nota impuesto
    wsr.cell(row=r + 1, column=2,
             value="Nota: impuesto a la renta estimado al 29.5% (Régimen General). Ajusta tu tasa según tu régimen (RER/NRUS/MYPE).")
    wsr.cell(row=r + 1, column=2).font = Font(italic=True, size=9, color="808080")

    fila_utilidad_neta = fr["u_neta"]
    # Para que el balance cuadre se usa el resultado ANTES de impuestos
    # (el impuesto del ER es una estimación que aún no está asentada en el diario).
    fila_resultado_sf = fr["u_ai"]

    # -------------------------------------------------------------------
    # 8. ESTADO DE SITUACIÓN FINANCIERA  (automático)
    # -------------------------------------------------------------------
    wss = wb.create_sheet("Situación Financiera")
    wss.sheet_view.showGridLines = False
    estilo_titulo(wss, "A1", "ESTADO DE SITUACIÓN FINANCIERA (automático)")
    wss["A2"] = "Activo = Pasivo + Patrimonio"
    wss["A2"].font = Font(italic=True, color="595959", size=10)
    for col, w in (("A", 4), ("B", 40), ("C", 18), ("D", 4), ("E", 40), ("F", 18)):
        wss.column_dimensions[col].width = w

    def rubro_neto_deudor(rubro):
        # activos: saldo deudor - acreedor (p.ej. depreciación)
        return (f'ROUND(SUMIF({bal_rubro},"{rubro}",{bal_deudor})'
                f'-SUMIF({bal_rubro},"{rubro}",{bal_acreedor}),2)')

    def rubro_neto_acreedor(rubro):
        return (f'ROUND(SUMIF({bal_rubro},"{rubro}",{bal_acreedor})'
                f'-SUMIF({bal_rubro},"{rubro}",{bal_deudor}),2)')

    # ACTIVO (columna B/C)
    wss.cell(row=4, column=2, value="ACTIVO").font = Font(bold=True, color=BLANCO, size=12)
    wss.cell(row=4, column=2).fill = header_fill(AZUL)
    wss.cell(row=4, column=3).fill = header_fill(AZUL)
    wss.cell(row=5, column=2, value="Activo Corriente")
    wss.cell(row=5, column=3, value=f"={rubro_neto_deudor('Activo Corriente')}")
    wss.cell(row=6, column=2, value="Activo No Corriente")
    wss.cell(row=6, column=3, value=f"={rubro_neto_deudor('Activo No Corriente')}")
    wss.cell(row=7, column=2, value="TOTAL ACTIVO").font = Font(bold=True, color=BLANCO)
    wss.cell(row=7, column=2).fill = header_fill(VERDE)
    wss.cell(row=7, column=3, value="=C5+C6")
    wss.cell(row=7, column=3).font = Font(bold=True, color=BLANCO)
    wss.cell(row=7, column=3).fill = header_fill(VERDE)

    # PASIVO + PATRIMONIO (columna E/F)
    wss.cell(row=4, column=5, value="PASIVO Y PATRIMONIO").font = Font(bold=True, color=BLANCO, size=12)
    wss.cell(row=4, column=5).fill = header_fill(AZUL)
    wss.cell(row=4, column=6).fill = header_fill(AZUL)
    wss.cell(row=5, column=5, value="Pasivo Corriente")
    wss.cell(row=5, column=6, value=f"={rubro_neto_acreedor('Pasivo Corriente')}")
    wss.cell(row=6, column=5, value="Pasivo No Corriente")
    wss.cell(row=6, column=6, value=f"={rubro_neto_acreedor('Pasivo No Corriente')}")
    wss.cell(row=7, column=5, value="Patrimonio (capital + reservas)")
    wss.cell(row=7, column=6, value=f"={rubro_neto_acreedor('Patrimonio')}")
    wss.cell(row=8, column=5, value="Resultado del ejercicio (antes de imp.)")
    wss.cell(row=8, column=6, value=f"='Estado Resultados'!C{fila_resultado_sf}")
    wss.cell(row=9, column=5, value="TOTAL PASIVO Y PATRIMONIO").font = Font(bold=True, color=BLANCO)
    wss.cell(row=9, column=5).fill = header_fill(VERDE)
    wss.cell(row=9, column=6, value="=F5+F6+F7+F8")
    wss.cell(row=9, column=6).font = Font(bold=True, color=BLANCO)
    wss.cell(row=9, column=6).fill = header_fill(VERDE)

    for (rr, cc) in [(5,3),(6,3),(7,3),(5,6),(6,6),(7,6),(8,6),(9,6)]:
        wss.cell(row=rr, column=cc).number_format = NUM_SOLES

    # verificación de cuadre del balance
    wss.cell(row=11, column=2, value="Verificación (Activo = Pasivo+Patrimonio):").font = Font(bold=True)
    wss.cell(row=11, column=5,
             value='=IF(ROUND(C7-F9,2)=0,"✔ BALANCE CUADRA","✗ DIFERENCIA: revisa asientos")')
    wss.cell(row=11, column=5).font = Font(bold=True, color=VERDE, size=12)

    # bordes a las celdas de datos
    for rr in range(4, 10):
        for cc in (2, 3, 5, 6):
            cell = wss.cell(row=rr, column=cc)
            if cell.value is not None or cc in (3, 6):
                cell.border = BORDER

    # -------------------------------------------------------------------
    # Orden de pestañas y guardado
    # -------------------------------------------------------------------
    out = "monkys-contabilidad.xlsx"
    wb.save(out)
    print("Generado:", out)


if __name__ == "__main__":
    construir()
