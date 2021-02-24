module.exports = {
	report(year, month) {
		return `
			SELECT
		    d.*
		  FROM (
		    SELECT
		      b.tgl_jual,
		      SUM(c.FOOD) AS FOOD,
		      SUM(c.bev) AS BEV,
		      SUM(c.bev1) AS BEV1,
		      SUM(c.CIGARETTE) AS CIGARETTE,
		      SUM(c.MINIBAR) AS MINIBAR,
		      SUM(b.tot_gross) AS JUMLAH,
		      SUM(b.tot_service) AS TAX,
		      SUM(b.tot_tax) AS SERVICE,
		      SUM(b.tot_grand) AS TOTAL
		    FROM karaoke.t_jual AS b
		    LEFT JOIN (
		      SELECT
		        a.kd_jual,
		        SUM(IF(a.nm_kat = 'FOOD', a.jml_jual * a.hrg_jual, 0)) AS FOOD,
		        SUM(IF(a.nm_kat = 'BEV', a.jml_jual * a.hrg_jual, 0)) AS bev,
		        SUM(IF(a.nm_kat = 'BEV1', a.jml_jual * a.hrg_jual, 0)) AS bev1,
		        SUM(IF(a.nm_kat = 'CIGARETTE', a.jml_jual * a.hrg_jual, 0)) AS CIGARETTE,
		        SUM(IF(a.nm_kat = 'MINIBAR', a.jml_jual * a.hrg_jual, 0)) AS MINIBAR
		      FROM karaoke.t_jual_detail AS a
		      GROUP BY a.kd_jual) AS c
		    ON b.kd_jual = c.kd_jual
		    GROUP BY b.tgl_jual
		  ) AS d
		  WHERE YEAR(d.tgl_jual) = ${year}
		  AND MONTH(d.tgl_jual) = ${month}
			`;
	},
	reportTarget(year, month) {
		return `
			SELECT
		    d.*
		  FROM (
		    SELECT
		      b.tgl_jual,
		      SUM(c.FOOD) AS FOOD,
		      SUM(c.bev) AS BEV,
		      SUM(c.bev1) AS BEV1,
		      SUM(c.CIGARETTE) AS CIGARETTE,
		      SUM(c.MINIBAR) AS MINIBAR,
		      SUM(b.tot_gross) AS JUMLAH,
		      SUM(b.tot_service) AS TAX,
		      SUM(b.tot_tax) AS SERVICE,
		      SUM(b.tot_grand) AS TOTAL
		    FROM karaoke.tmp_t_jual AS b
		    LEFT JOIN (
		      SELECT
		        a.kd_jual,
		        SUM(IF(a.nm_kat = 'FOOD', a.jml_jual * a.hrg_jual, 0)) AS FOOD,
		        SUM(IF(a.nm_kat = 'BEV', a.jml_jual * a.hrg_jual, 0)) AS bev,
		        SUM(IF(a.nm_kat = 'BEV1', a.jml_jual * a.hrg_jual, 0)) AS bev1,
		        SUM(IF(a.nm_kat = 'CIGARETTE', a.jml_jual * a.hrg_jual, 0)) AS CIGARETTE,
		        SUM(IF(a.nm_kat = 'MINIBAR', a.jml_jual * a.hrg_jual, 0)) AS MINIBAR
		      FROM karaoke.tmp_t_jual_detail AS a
		      GROUP BY a.kd_jual) AS c
		    ON b.kd_jual = c.kd_jual
		    GROUP BY b.tgl_jual
		  ) AS d
		  WHERE YEAR(d.tgl_jual) = ${year}
		  AND MONTH(d.tgl_jual) = ${month}
			`;
	},
	postingTodaySales() {
		return `
			INSERT INTO t_jual 
			SELECT 
				kd_jual,
				tgl_jual,
				'00:00:00' AS jam_jual,
				kd_user,
				meja,
				nm_plgn,
				SUM(jml_jual * hrg_jual) AS tot_gross,
				SUM(jml_jual * dskn_jual) AS tot_disk,
				SUM(jml_jual * service_jual) AS tot_service,
				SUM(jml_jual*tax_jual) AS tot_tax,
				SUM(total_detail) AS tot_grand,
				'0' AS sts_jual 
			FROM temp_t_jual_detail
			WHERE tgl_jual = CURDATE() 
			GROUP BY kd_jual
		`;
	},
	postingTodaySalesDetail() {
		return `
			INSERT INTO t_jual_detail
			SELECT 
				kd_jual,
				kd_brg,
				jml_jual,
				hrg_jual,
				dskn_jual,
				service_jual,
				tax_jual,
				total_detail,
				nm_kat 
			FROM temp_t_jual_detail
			WHERE tgl_jual = CURDATE() 
		`;
	},
};
