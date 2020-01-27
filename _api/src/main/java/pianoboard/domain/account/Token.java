package pianoboard.domain.account;

import javax.naming.AuthenticationException;

public class Token {

	private String token;
	private String accountID;
	private long expDate;

	public Token() {}

	public Token(String accountID, String token, long expDate) {
		this.accountID = accountID;
		this.token = token;
		this.expDate = expDate;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getToken()		{ return this.token;	}
	public String getAccountID()	{ return this.accountID;	}
	public long getExpDate()		{ return this.expDate;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setToken(String token)			{ this.token = token;		}
	public void setAccountID(String accountID)	{ this.accountID = accountID;		}
	public void setExpDate(long expDate)		{ this.expDate = expDate;	}

	public boolean equals(Token t) throws AuthenticationException {
		if(t.getAccountID().equals(this.accountID)) {
			if(t.getToken().equals(this.token) && t.getExpDate() == this.expDate) return true;
			throw new AuthenticationException("Invalid Token");
		}
		return false;
	}
}
