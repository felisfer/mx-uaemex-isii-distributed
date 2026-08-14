CREATE TABLE empleado (
	id SERIAL PRIMARY KEY,
	rfc VARCHAR(13) NOT NULL UNIQUE,
	nombres VARCHAR(50) NOT NULL,
	apellidos VARCHAR(50) NOT NULL,
	correo VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE acceso (
	id SERIAL PRIMARY KEY,
	id_empleado INT REFERENCES empleado(id) ON DELETE CASCADE NOT NULL UNIQUE,
	hashed_password TEXT NOT NULL
);

CREATE TABLE nomina (
	id SERIAL PRIMARY KEY,
	id_empleado INT REFERENCES empleado(id) ON DELETE CASCADE NOT NULL,
	salario_bruto FLOAT NOT NULL,
	excedente FLOAT NOT NULL,
	cuota_fija FLOAT NOT NULL,
	porcentaje FLOAT NOT NULL,
	periodo_inicio DATE NOT NULL,
	periodo_fin DATE NOT NULL
);
