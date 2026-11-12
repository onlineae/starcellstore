@echo off
title FLINN iPHONES - Servidor Local
echo =======================================================
echo    FLINN iPHONES - Servidor de Vendas e Rastreio
echo =======================================================
echo.
echo Iniciando servidor Node.js...
echo.
echo Loja:     http://localhost:3000
echo Rastreio: http://localhost:3000/rastreio
echo Admin:    http://localhost:3000/admin (Senha: 1103)
echo.
echo Para fechar o servidor, pressione CTRL + C ou feche esta janela.
echo =======================================================
echo.
node server.js
pause
