package ebay.product;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.jws.WebService;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@WebService
public class productService {
	public String addProduct(int userid, String itemName, String itemDescription, int itemQuantity, int itemPrice, String sellerName, String bidding){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement = conn.prepareStatement("insert into ebay.products (userid, sellerName, itemName, itemDescription, itemQuantity, bidding, itemPrice)"
					+ "values (?, ?, ?, ?, ?, ?, ?)");
			statement.setInt(1, userid);
			statement.setString(2, sellerName);
			statement.setString(3, itemName);
			statement.setString(4, itemDescription);			
			statement.setInt(5, itemQuantity);
			statement.setString(6, bidding);
			statement.setInt(7, itemPrice);		
			
			int rs = statement.executeUpdate();
			if(rs == 1){
//				JSONArray jsonArray = new JSONArray();
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(200));
			    obj.put("msg","success");				  
			    str= obj.toString();
			}else{
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(401));
			    System.out.println("Error in adding the new product");
			    obj.put("msg","couldn't add the product");
			    str= obj.toString();
			}
		}
		catch(ClassNotFoundException ex){
			ex.printStackTrace();
		}catch(SQLException ex){
			ex.printStackTrace();
		}catch(JSONException ex){
			ex.printStackTrace();
		}		
		return str;
	}
	
	public String getAllProducts(int userid){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement = conn.prepareStatement("select * from products where productid not in (select productid from shoppingcart where shoppingcart.userid = ?)"
					+ " and productid not in (select productid from bidtable where bidtable.userid = ?) and userid != ?");
			
			statement.setInt(1, userid);
			statement.setInt(2, userid);
			statement.setInt(3, userid);
			
			ResultSet rs = statement.executeQuery();
			System.out.println(rs);
			obj = new JSONObject();
			JSONArray jsarray = new JSONArray();
			while(rs.next()){			
				int total_rows = rs.getMetaData().getColumnCount();
		        JSONObject obj1 = new JSONObject();
		        for(int i = 0; i < total_rows; i++) {		            
					obj1.put(rs.getMetaData().getColumnLabel(i + 1).toLowerCase(), rs.getObject(i + 1));					
		        }
		        jsarray.put(obj1);
			}
			obj.put("statusCode",new Integer(200));
			obj.put("msg","success");			  
		    obj.put("products", jsarray);
			str = obj.toString();
		} catch(ClassNotFoundException e) {
			e.printStackTrace();
		} catch(SQLException e) {
			e.printStackTrace();
		} catch(JSONException e){
			e.printStackTrace();
		}
		return str;
	}
	
	public String addToBid(int userid, int productid, double bidamount, int selectedquantity){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement = conn.prepareStatement("insert into bidTable (productId, userid, bidamount, selectedQuantity) values (?, ?, ?, ?)"
					+ " on duplicate key update selectedQuantity = ? , bidamount = ? ");
			statement.setInt(1, productid);
			statement.setInt(2, userid);
			statement.setDouble(3, bidamount);
			statement.setInt(4, selectedquantity);
			statement.setInt(5, selectedquantity);
			statement.setDouble(6, bidamount);
			int rs = statement.executeUpdate();
			if(rs == 1){
//				JSONArray jsonArray = new JSONArray();
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(200));
			    obj.put("msg","success");				  
			    str= obj.toString();
			}else{
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(401));
			    System.out.println("Error in adding the new product");
			    obj.put("msg","couldn't add the product");
			    str= obj.toString();
			}
		}
		catch(ClassNotFoundException e) {
			e.printStackTrace();
		} catch(SQLException e) {
			e.printStackTrace();
		} catch(JSONException e){
			e.printStackTrace();
		}
		return str;
	}
	
}
