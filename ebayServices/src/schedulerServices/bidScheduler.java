package schedulerServices;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.jws.WebService;

import org.json.JSONException;
import org.json.JSONObject;

@WebService
public class bidScheduler {
	public String bid(){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement = conn.prepareStatement("Select * from products where postingDate <= NOW() - INTERVAL 4 DAY and bidding=\'true\'");
			ResultSet rs = statement.executeQuery();
			
		}
		catch(ClassNotFoundException e) {
			e.printStackTrace();
		} catch(SQLException e) {
			e.printStackTrace();
		} 
//		catch(JSONException e){
//			e.printStackTrace();
//		}
		return str;
	}
}
